import { useState, useEffect } from 'react';
import { DiravCard, DiravButton } from '@/core/widgets';
import { DiravColors } from '@/core/theme/colors';
import { MockDatabase, TransactionModel } from '@/data/mockDatabase';
import { CheckIcon, PlusIcon } from '@/core/icons/Icons';
import { getTransactions, saveTransactions } from '@/services/storageService';

export function PlanningScreen() {
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [transactions, setTransactions] = useState<TransactionModel[]>(() => {
    const saved = getTransactions();
    return saved || MockDatabase.transactions;
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; amount?: string; category?: string }>({});

  // Save transactions when they change
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const categories = transactionType === 'expense' 
    ? ['Food & Drinks', 'Education', 'Entertainment', 'Health', 'Transport', 'Shopping', 'Other']
    : ['Income', 'Freelance', 'Gift', 'Other'];

  const monthlyAllowance = transactions
    .filter((t) => !t.isExpense)
    .reduce((acc, t) => acc + t.amount, 0);
  
  const totalExpenses = transactions
    .filter((t) => t.isExpense)
    .reduce((acc, t) => acc + t.amount, 0);

  const spentPercentage = monthlyAllowance > 0 ? Math.min((totalExpenses / monthlyAllowance) * 100, 100) : 0;
  const remaining = monthlyAllowance - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const validateForm = () => {
    const newErrors: { title?: string; amount?: string; category?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Please enter a title';
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!category) {
      newErrors.category = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newTransaction: TransactionModel = {
      id: Date.now().toString(),
      title: title.trim(),
      date: new Date(),
      amount: parseFloat(amount),
      isExpense: transactionType === 'expense',
      category: category,
    };

    setTransactions([newTransaction, ...transactions]);
    setShowSuccess(true);
    
    // Reset form
    setTitle('');
    setAmount('');
    setCategory('');
    setErrors({});

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getProgressColor = () => {
    if (spentPercentage > 80) return DiravColors.error;
    if (spentPercentage > 60) return DiravColors.warning;
    return DiravColors.primary;
  };

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">Budget Planning</h1>
        <p className="text-sm sm:text-base text-[#6B7280] mt-1">Track and manage your monthly budget</p>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#10B981] text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckIcon size={20} />
          <span className="font-medium">Transaction added successfully!</span>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Monthly Allowance Card */}
        <DiravCard className="lg:row-span-2" padding="sm">
          <div className="p-2 sm:p-4">
            <h3 className="text-base sm:text-lg font-semibold text-[#111827] mb-4">Monthly Overview</h3>
            
            {/* Big Amount */}
            <div className="mb-6">
              <p className="text-3xl sm:text-4xl font-bold text-[#7C3AED]">
                {formatCurrency(monthlyAllowance)}
              </p>
              <p className="text-sm text-[#6B7280] mt-1">Total Income</p>
            </div>

            {/* Progress Section */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Spent</span>
                <span className="font-medium text-[#111827]">
                  {formatCurrency(totalExpenses)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${spentPercentage}%`,
                    backgroundColor: getProgressColor(),
                  }}
                />
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Remaining</span>
                <span
                  className="font-medium"
                  style={{
                    color: remaining < 0 ? DiravColors.error : DiravColors.success,
                  }}
                >
                  {formatCurrency(remaining)}
                </span>
              </div>
            </div>

            {/* Budget Tips */}
            <div className="p-4 rounded-xl bg-[#7C3AED]/5 border border-[#7C3AED]/10">
              <p className="text-sm font-medium text-[#7C3AED] mb-1">💡 Budget Tip</p>
              <p className="text-sm text-[#6B7280]">
                {monthlyAllowance === 0
                  ? 'Start by adding your income to track your budget!'
                  : spentPercentage === 0
                  ? 'Great! You haven\'t spent anything yet. Log your expenses to track them.'
                  : spentPercentage < 50
                  ? 'Great job staying on track!'
                  : spentPercentage < 80
                  ? 'Consider reviewing your spending.'
                  : 'Time to cut back on expenses!'}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="p-3 sm:p-4 rounded-xl bg-[#10B981]/5">
                <p className="text-xl sm:text-2xl font-bold text-[#10B981]">
                  {transactions.filter((t) => !t.isExpense).length}
                </p>
                <p className="text-xs sm:text-sm text-[#6B7280]">Income entries</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-[#EF4444]/5">
                <p className="text-xl sm:text-2xl font-bold text-[#EF4444]">
                  {transactions.filter((t) => t.isExpense).length}
                </p>
                <p className="text-xs sm:text-sm text-[#6B7280]">Expense entries</p>
              </div>
            </div>
          </div>
        </DiravCard>

        {/* Add Transaction Card */}
        <DiravCard padding="sm">
          <div className="p-2 sm:p-4">
            <h3 className="text-base sm:text-lg font-semibold text-[#111827] mb-4">Add Transaction</h3>

            <div className="space-y-4">
              {/* Type Toggle */}
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1.5">
                  Type
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setTransactionType('expense');
                      setCategory('');
                    }}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                      transactionType === 'expense'
                        ? 'bg-[#EF4444]/10 border-2 border-[#EF4444] text-[#EF4444]'
                        : 'bg-gray-50 border-2 border-transparent text-[#6B7280] hover:bg-gray-100'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    onClick={() => {
                      setTransactionType('income');
                      setCategory('');
                    }}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                      transactionType === 'income'
                        ? 'bg-[#10B981]/10 border-2 border-[#10B981] text-[#10B981]'
                        : 'bg-gray-50 border-2 border-transparent text-[#6B7280] hover:bg-gray-100'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: undefined });
                  }}
                  placeholder="e.g., Coffee, Groceries, Salary"
                  className={`w-full px-4 py-3 rounded-xl border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all ${
                    errors.title ? 'border-[#EF4444]' : 'border-gray-200'
                  }`}
                />
                {errors.title && (
                  <p className="text-xs text-[#EF4444] mt-1">{errors.title}</p>
                )}
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1.5">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
                    $
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (errors.amount) setErrors({ ...errors, amount: undefined });
                    }}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={`w-full pl-8 pr-4 py-3 rounded-xl border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all ${
                      errors.amount ? 'border-[#EF4444]' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.amount && (
                  <p className="text-xs text-[#EF4444] mt-1">{errors.amount}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1.5">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        if (errors.category) setErrors({ ...errors, category: undefined });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                        category === cat
                          ? 'bg-[#7C3AED] text-white'
                          : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="text-xs text-[#EF4444] mt-1">{errors.category}</p>
                )}
              </div>

              {/* Submit Button */}
              <DiravButton
                label="Add Transaction"
                onClick={handleSubmit}
                fullWidth
                icon={<PlusIcon size={18} />}
              />
            </div>
          </div>
        </DiravCard>

        {/* Recent Activity */}
        <DiravCard padding="sm">
          <div className="p-2 sm:p-4">
            <h3 className="text-base sm:text-lg font-semibold text-[#111827] mb-4">Recent Activity</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {transactions.length === 0 ? (
                <p className="text-center text-[#6B7280] py-4">No transactions yet</p>
              ) : (
                transactions.slice(0, 5).map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                        style={{
                          backgroundColor: t.isExpense ? `${DiravColors.error}15` : `${DiravColors.success}15`,
                          color: t.isExpense ? DiravColors.error : DiravColors.success,
                        }}
                      >
                        {t.isExpense ? '−' : '+'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#111827]">{t.title}</p>
                        <p className="text-xs text-[#6B7280]">{t.category}</p>
                      </div>
                    </div>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: t.isExpense ? DiravColors.error : DiravColors.success }}
                    >
                      {t.isExpense ? '−' : '+'}${t.amount.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </DiravCard>
      </div>
    </div>
  );
}
