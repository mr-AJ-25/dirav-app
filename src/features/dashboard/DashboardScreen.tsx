import { useState, useEffect } from 'react';
import { DiravCard, DiravBadge, SectionHeader } from '@/core/widgets';
import { DiravColors } from '@/core/theme/colors';
import { MockDatabase, TransactionModel } from '@/data/mockDatabase';
import { WalletIcon, SavingsIcon, TrendUpIcon, TagIcon, CloseIcon, CheckIcon } from '@/core/icons/Icons';
import { getTransactions, saveTransactions, getSavingsGoals } from '@/services/storageService';
import { useAuth } from '@/context/AuthContext';

export function DashboardScreen() {
  const { user, isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState<TransactionModel[]>(() => {
    const saved = getTransactions();
    return saved || MockDatabase.transactions;
  });
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionModel | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Save transactions when they change
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // Calculate totals
  const totalBalance = transactions.reduce((acc, t) => {
    return acc + (t.isExpense ? -t.amount : t.amount);
  }, 0);

  const savedGoals = getSavingsGoals();
  const totalSavings = (savedGoals || MockDatabase.savings).reduce((acc, s) => acc + s.current, 0);

  const monthlyAllowance = transactions
    .filter((t) => !t.isExpense && t.category === 'Income')
    .reduce((acc, t) => acc + t.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const displayedTransactions = showAllTransactions 
    ? transactions 
    : transactions.slice(0, 4);

  const handleClaimOffer = () => {
    setClaimSuccess(true);
    setTimeout(() => {
      setShowClaimModal(false);
      setClaimSuccess(false);
    }, 2000);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setSelectedTransaction(null);
  };

  const getUserName = () => {
    if (isAuthenticated && user) {
      return user.name.split(' ')[0];
    }
    return 'Student';
  };

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">Welcome back, {getUserName()}</h1>
        <p className="text-sm sm:text-base text-[#6B7280] mt-1">Here's your financial pulse</p>
      </div>

      {/* Hero Banner */}
      <div
        className="relative h-[180px] sm:h-[220px] rounded-2xl sm:rounded-3xl overflow-hidden mb-4 sm:mb-6"
        style={{
          background: `linear-gradient(135deg, ${DiravColors.primary} 0%, ${DiravColors.accentGradientEnd} 100%)`,
        }}
      >
        {/* Background Icon */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10">
          <TagIcon size={150} className="text-white rotate-12 sm:w-[200px] sm:h-[200px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-6">
          <DiravBadge
            label="Featured Opportunity"
            color="rgba(255,255,255,0.2)"
            textColor="white"
          />

          <div>
            <p className="text-white/80 text-xs sm:text-sm mb-1">Limited Time Offer</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">40% OFF</h2>
            <button 
              onClick={() => setShowClaimModal(true)}
              className="bg-white text-[#7C3AED] font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl hover:bg-white/90 transition-all shadow-lg text-sm sm:text-base active:scale-95"
            >
              Claim Now
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Total Balance */}
          <DiravCard padding="sm" className="flex items-center gap-3 sm:gap-4">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${DiravColors.primary}15` }}
            >
              <WalletIcon size={20} className="text-[#7C3AED] sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-[#6B7280]">Total Balance</p>
              <p className="text-lg sm:text-xl font-bold text-[#111827] truncate">
                {formatCurrency(totalBalance)}
              </p>
            </div>
          </DiravCard>

          {/* Total Savings */}
          <DiravCard padding="sm" className="flex items-center gap-3 sm:gap-4">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${DiravColors.info}15` }}
            >
              <SavingsIcon size={20} className="text-[#3B82F6] sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-[#6B7280]">Total Savings</p>
              <p className="text-lg sm:text-xl font-bold text-[#111827] truncate">
                {formatCurrency(totalSavings)}
              </p>
            </div>
          </DiravCard>

          {/* Monthly Allowance */}
          <DiravCard padding="sm" className="flex items-center gap-3 sm:gap-4">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${DiravColors.success}15` }}
            >
              <TrendUpIcon size={20} className="text-[#10B981] sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-[#6B7280]">Monthly Income</p>
              <p className="text-lg sm:text-xl font-bold text-[#111827] truncate">
                {formatCurrency(monthlyAllowance)}
              </p>
            </div>
          </DiravCard>
        </div>
      </div>

      {/* Recent Transactions */}
      <DiravCard padding="sm" className="sm:p-6">
        <SectionHeader 
          title="Recent Transactions" 
          actionLabel={showAllTransactions ? "Show Less" : "See All"}
          onAction={() => setShowAllTransactions(!showAllTransactions)}
        />
        <div className="space-y-2 sm:space-y-3">
          {displayedTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6B7280]">No transactions yet</p>
              <p className="text-sm text-[#6B7280] mt-1">Go to Planning to add your first transaction</p>
            </div>
          ) : (
            displayedTransactions.map((transaction) => (
              <button
                key={transaction.id}
                onClick={() => setSelectedTransaction(transaction)}
                className="w-full flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: transaction.isExpense
                      ? `${DiravColors.error}15`
                      : `${DiravColors.success}15`,
                  }}
                >
                  {transaction.isExpense ? (
                    <span className="text-[#EF4444] font-bold">−</span>
                  ) : (
                    <span className="text-[#10B981] font-bold">+</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#111827] text-sm sm:text-base truncate">{transaction.title}</p>
                  <p className="text-xs sm:text-sm text-[#6B7280] truncate">
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>
                <p
                  className="font-semibold text-sm sm:text-base flex-shrink-0"
                  style={{
                    color: transaction.isExpense
                      ? DiravColors.error
                      : DiravColors.success,
                  }}
                >
                  {transaction.isExpense ? '−' : '+'}
                  {formatCurrency(transaction.amount)}
                </p>
              </button>
            ))
          )}
        </div>
      </DiravCard>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-md shadow-xl animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#111827]">Transaction Details</h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <CloseIcon size={20} className="text-[#6B7280]" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: selectedTransaction.isExpense
                      ? `${DiravColors.error}15`
                      : `${DiravColors.success}15`,
                  }}
                >
                  {selectedTransaction.isExpense ? (
                    <span className="text-2xl text-[#EF4444] font-bold">−</span>
                  ) : (
                    <span className="text-2xl text-[#10B981] font-bold">+</span>
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#111827]">{selectedTransaction.title}</h4>
                  <p className="text-[#6B7280]">{selectedTransaction.category}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-[#6B7280]">Amount</span>
                  <span
                    className="font-bold"
                    style={{
                      color: selectedTransaction.isExpense
                        ? DiravColors.error
                        : DiravColors.success,
                    }}
                  >
                    {selectedTransaction.isExpense ? '−' : '+'}
                    {formatCurrency(selectedTransaction.amount)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-[#6B7280]">Date</span>
                  <span className="font-medium text-[#111827]">
                    {selectedTransaction.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Type</span>
                  <DiravBadge
                    label={selectedTransaction.isExpense ? 'Expense' : 'Income'}
                    color={selectedTransaction.isExpense ? DiravColors.error : DiravColors.success}
                    textColor="white"
                  />
                </div>
              </div>

              <button
                onClick={() => handleDeleteTransaction(selectedTransaction.id)}
                className="w-full py-3 rounded-xl font-semibold text-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 transition-colors"
              >
                Delete Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Claim Offer Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl text-center animate-scale-in">
            {claimSuccess ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                  <CheckIcon size={32} className="text-[#10B981]" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-2">Offer Claimed!</h3>
                <p className="text-[#6B7280]">Your 40% discount has been applied to your account.</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#7C3AED]/20 flex items-center justify-center">
                  <TagIcon size={32} className="text-[#7C3AED]" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-2">Claim 40% Off</h3>
                <p className="text-[#6B7280] mb-6">Get exclusive student discount on textbooks and study materials!</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClaimModal(false)}
                    className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-[#6B7280] hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClaimOffer}
                    className="flex-1 py-3 rounded-xl font-semibold bg-[#7C3AED] text-white hover:bg-[#8B5CF6] transition-colors"
                  >
                    Claim Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
