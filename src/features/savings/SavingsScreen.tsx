import { useState, useEffect } from 'react';
import { DiravCard, DiravButton, DiravBadge, SectionHeader } from '@/core/widgets';
import { DiravColors } from '@/core/theme/colors';
import { MockDatabase, SavingsModel } from '@/data/mockDatabase';
import { SavingsIcon, PlusIcon, CloseIcon, CheckIcon } from '@/core/icons/Icons';
import { getSavingsGoals, saveSavingsGoals } from '@/services/storageService';

export function SavingsScreen() {
  const [savings, setSavings] = useState<SavingsModel[]>(() => {
    const saved = getSavingsGoals();
    return saved || MockDatabase.savings;
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState<SavingsModel | null>(null);
  const [addAmount, setAddAmount] = useState('');
  const [newGoal, setNewGoal] = useState({ title: '', target: '', icon: '🎯' });
  const [errors, setErrors] = useState<{ title?: string; target?: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Save to localStorage when savings change
  useEffect(() => {
    saveSavingsGoals(savings);
  }, [savings]);

  const totalSavings = savings.reduce((acc, s) => acc + s.current, 0);
  const totalTarget = savings.reduce((acc, s) => acc + s.target, 0);

  const icons = ['🎯', '💻', '✈️', '🚗', '🏠', '📱', '🎓', '💎', '🛡️', '🎮', '📚', '🏖️'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const showSuccessToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAddMoney = () => {
    if (!addAmount || parseFloat(addAmount) <= 0 || !showAddMoneyModal) return;

    const amount = parseFloat(addAmount);
    setSavings(prev => prev.map(s => {
      if (s.id === showAddMoneyModal.id) {
        const newCurrent = Math.min(s.current + amount, s.target);
        return {
          ...s,
          current: newCurrent,
          isCompleted: newCurrent >= s.target,
        };
      }
      return s;
    }));

    showSuccessToast(`Added ${formatCurrency(amount)} to ${showAddMoneyModal.title}!`);
    setShowAddMoneyModal(null);
    setAddAmount('');
  };

  const handleCreateGoal = () => {
    const newErrors: { title?: string; target?: string } = {};
    
    if (!newGoal.title.trim()) {
      newErrors.title = 'Please enter a goal name';
    }
    
    if (!newGoal.target || parseFloat(newGoal.target) <= 0) {
      newErrors.target = 'Please enter a valid target amount';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const goal: SavingsModel = {
      id: Date.now().toString(),
      title: newGoal.title.trim(),
      current: 0,
      target: parseFloat(newGoal.target),
      isCompleted: false,
      icon: newGoal.icon,
    };

    setSavings(prev => [...prev, goal]);
    showSuccessToast('New savings goal created!');
    setShowAddModal(false);
    setNewGoal({ title: '', target: '', icon: '🎯' });
    setErrors({});
  };

  const handleDeleteGoal = (id: string) => {
    setSavings(prev => prev.filter(s => s.id !== id));
    showSuccessToast('Goal deleted');
  };

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#10B981] text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckIcon size={20} />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">Savings Goals</h1>
        <p className="text-sm sm:text-base text-[#6B7280] mt-1">Track your progress towards financial goals</p>
      </div>

      {/* Summary Card */}
      <DiravCard className="mb-4 sm:mb-6" padding="sm">
        <div className="p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${DiravColors.info}15` }}
              >
                <SavingsIcon size={24} className="text-[#3B82F6] sm:w-7 sm:h-7" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[#6B7280]">Total Saved</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#111827]">
                  {formatCurrency(totalSavings)}
                </p>
                <p className="text-xs sm:text-sm text-[#6B7280]">
                  of {formatCurrency(totalTarget)} target
                </p>
              </div>
            </div>
            <DiravButton
              label="New Goal"
              size="sm"
              icon={<PlusIcon size={18} />}
              onClick={() => setShowAddModal(true)}
            />
          </div>

          {/* Overall Progress */}
          {totalTarget > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#6B7280]">Overall Progress</span>
                <span className="font-medium text-[#7C3AED]">
                  {((totalSavings / totalTarget) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(totalSavings / totalTarget) * 100}%`,
                    backgroundColor: DiravColors.primary,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </DiravCard>

      {/* Savings Grid */}
      <SectionHeader title="Your Goals" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {savings.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          
          return (
            <DiravCard key={goal.id} padding="sm">
              <div className="p-2 sm:p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <h3 className="font-semibold text-[#111827] text-sm sm:text-base">{goal.title}</h3>
                      {goal.isCompleted && (
                        <DiravBadge
                          label="Completed ✓"
                          color={DiravColors.success}
                          textColor="white"
                          className="mt-1"
                        />
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-1 rounded-lg hover:bg-gray-100 text-[#6B7280] hover:text-[#EF4444] transition-colors"
                  >
                    <CloseIcon size={16} />
                  </button>
                </div>

                {/* Amount Row */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span
                    className="text-xl sm:text-2xl font-bold"
                    style={{ color: DiravColors.primary }}
                  >
                    {formatCurrency(goal.current)}
                  </span>
                  <span className="text-sm text-[#6B7280]">
                    / {formatCurrency(goal.target)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor: goal.isCompleted
                          ? DiravColors.success
                          : DiravColors.primary,
                      }}
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                    {progress.toFixed(0)}% complete
                  </p>
                </div>

                {/* Action Button */}
                {!goal.isCompleted ? (
                  <DiravButton
                    label="Add Money"
                    isOutlined
                    fullWidth
                    size="sm"
                    onClick={() => setShowAddMoneyModal(goal)}
                  />
                ) : (
                  <div className="w-full py-2 text-sm font-medium text-center text-[#10B981] bg-[#10B981]/10 rounded-xl">
                    Goal Achieved! 🎉
                  </div>
                )}
              </div>
            </DiravCard>
          );
        })}

        {/* Add New Goal Card */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="border-2 border-dashed border-gray-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center gap-3 hover:border-[#7C3AED] hover:bg-[#7C3AED]/5 transition-all min-h-[200px]"
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${DiravColors.primary}10` }}
          >
            <PlusIcon size={24} className="text-[#7C3AED]" />
          </div>
          <span className="font-medium text-[#6B7280]">Add New Goal</span>
        </button>
      </div>

      {/* Add Money Modal */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-md shadow-xl animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#111827]">Add Money</h3>
              <button
                onClick={() => {
                  setShowAddMoneyModal(null);
                  setAddAmount('');
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <CloseIcon size={20} className="text-[#6B7280]" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-4">
              <span className="text-2xl">{showAddMoneyModal.icon}</span>
              <div>
                <p className="font-medium text-[#111827]">{showAddMoneyModal.title}</p>
                <p className="text-sm text-[#6B7280]">
                  {formatCurrency(showAddMoneyModal.current)} of {formatCurrency(showAddMoneyModal.target)}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#6B7280] mb-1.5">
                Amount to add
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">$</span>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  max={showAddMoneyModal.target - showAddMoneyModal.current}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
                  autoFocus
                />
              </div>
              <p className="text-xs text-[#6B7280] mt-1">
                Remaining: {formatCurrency(showAddMoneyModal.target - showAddMoneyModal.current)}
              </p>
            </div>

            {/* Quick amounts */}
            <div className="flex gap-2 mb-4">
              {[10, 25, 50, 100].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAddAmount(amt.toString())}
                  className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-100 text-[#6B7280] hover:bg-[#7C3AED]/10 hover:text-[#7C3AED] transition-colors"
                >
                  ${amt}
                </button>
              ))}
            </div>

            <DiravButton
              label="Add Money"
              fullWidth
              onClick={handleAddMoney}
              disabled={!addAmount || parseFloat(addAmount) <= 0}
            />
          </div>
        </div>
      )}

      {/* Create Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-md shadow-xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#111827]">Create New Goal</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewGoal({ title: '', target: '', icon: '🎯' });
                  setErrors({});
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <CloseIcon size={20} className="text-[#6B7280]" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1.5">
                  Choose an icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {icons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewGoal({ ...newGoal, icon })}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                        newGoal.icon === icon
                          ? 'bg-[#7C3AED]/20 ring-2 ring-[#7C3AED]'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal Name */}
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1.5">
                  Goal name
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => {
                    setNewGoal({ ...newGoal, title: e.target.value });
                    if (errors.title) setErrors({ ...errors, title: undefined });
                  }}
                  placeholder="e.g., New Laptop, Vacation"
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all ${
                    errors.title ? 'border-[#EF4444]' : 'border-gray-200'
                  }`}
                />
                {errors.title && (
                  <p className="text-xs text-[#EF4444] mt-1">{errors.title}</p>
                )}
              </div>

              {/* Target Amount */}
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1.5">
                  Target amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">$</span>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => {
                      setNewGoal({ ...newGoal, target: e.target.value });
                      if (errors.target) setErrors({ ...errors, target: undefined });
                    }}
                    placeholder="0.00"
                    min="0"
                    className={`w-full pl-8 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all ${
                      errors.target ? 'border-[#EF4444]' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.target && (
                  <p className="text-xs text-[#EF4444] mt-1">{errors.target}</p>
                )}
              </div>

              <DiravButton
                label="Create Goal"
                fullWidth
                onClick={handleCreateGoal}
                icon={<PlusIcon size={18} />}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
