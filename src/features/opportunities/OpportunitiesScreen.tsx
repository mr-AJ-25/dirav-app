import { useState, useEffect } from 'react';
import { DiravCard, DiravBadge, DiravButton } from '@/core/widgets';
import { DiravColors } from '@/core/theme/colors';
import { MockDatabase, OpportunityModel } from '@/data/mockDatabase';
import { LocationIcon, ExternalLinkIcon, CloseIcon, CheckIcon, CalendarIcon, CopyIcon } from '@/core/icons/Icons';
import { getAppliedOffers, saveAppliedOffers } from '@/services/storageService';

const categories = ['All', 'Education', 'Tech', 'Health', 'Food', 'Arts'];

interface OpportunitiesScreenProps {
  embedded?: boolean;
}

export function OpportunitiesScreen({ embedded = false }: OpportunitiesScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityModel | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [appliedOffers, setAppliedOffers] = useState<string[]>(() => getAppliedOffers());

  useEffect(() => {
    saveAppliedOffers(appliedOffers);
  }, [appliedOffers]);

  const filteredOpportunities =
    selectedCategory === 'All'
      ? MockDatabase.opportunities
      : MockDatabase.opportunities.filter(
          (o) => o.category === selectedCategory
        );

  const formatValue = (opportunity: OpportunityModel) => {
    if (opportunity.type === 'Discount') {
      return `${opportunity.value}% OFF`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(opportunity.value || 0);
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'No expiry';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const showSuccessToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleApply = (opportunity: OpportunityModel) => {
    setAppliedOffers([...appliedOffers, opportunity.id]);
    if (opportunity.type === 'Scholarship') {
      showSuccessToast('Application submitted! Check your email for confirmation.');
    } else {
      showSuccessToast('Discount claimed! Code copied to clipboard.');
    }
    setSelectedOpportunity(null);
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    showSuccessToast('Link copied to clipboard!');
  };

  const handleOpenLink = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`min-h-full ${embedded ? 'p-4 pb-4' : 'p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8'}`}>
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#10B981] text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckIcon size={20} />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Header - hide when embedded */}
      {!embedded && (
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">Opportunities</h1>
          <p className="text-sm sm:text-base text-[#6B7280] mt-1">
            Discover discounts and scholarships for students
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4 sm:mb-6">
        <DiravCard padding="sm">
          <div className="text-center p-2">
            <p className="text-2xl sm:text-3xl font-bold text-[#F59E0B]">
              {MockDatabase.opportunities.filter(o => o.type === 'Discount').length}
            </p>
            <p className="text-xs sm:text-sm text-[#6B7280]">Discounts Available</p>
          </div>
        </DiravCard>
        <DiravCard padding="sm">
          <div className="text-center p-2">
            <p className="text-2xl sm:text-3xl font-bold text-[#3B82F6]">
              {MockDatabase.opportunities.filter(o => o.type === 'Scholarship').length}
            </p>
            <p className="text-xs sm:text-sm text-[#6B7280]">Scholarships</p>
          </div>
        </DiravCard>
      </div>

      {/* Filter Chips */}
      <div className="mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all text-sm ${
                selectedCategory === category
                  ? 'bg-[#7C3AED] text-white'
                  : 'bg-white text-[#6B7280] border border-gray-200 hover:border-[#7C3AED] hover:text-[#7C3AED]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {filteredOpportunities.map((opportunity) => {
          const isApplied = appliedOffers.includes(opportunity.id);
          
          return (
            <DiravCard key={opportunity.id} padding="sm" className="flex flex-col">
              <div className="p-2 sm:p-4 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <DiravBadge
                    label={opportunity.type}
                    color={
                      opportunity.type === 'Scholarship'
                        ? DiravColors.info
                        : DiravColors.warning
                    }
                    textColor="white"
                  />
                  <button 
                    onClick={() => handleOpenLink(opportunity.link)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ExternalLinkIcon size={18} className="text-[#6B7280]" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-[#111827] mb-1">
                    {opportunity.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] mb-3 sm:mb-4">{opportunity.vendor}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#6B7280]">
                    <LocationIcon size={14} />
                    <span>{opportunity.isOnline ? 'Online' : 'In-store'}</span>
                  </div>
                  <span
                    className="font-bold text-sm sm:text-base"
                    style={{
                      color:
                        opportunity.type === 'Scholarship'
                          ? DiravColors.success
                          : DiravColors.primary,
                    }}
                  >
                    {formatValue(opportunity)}
                  </span>
                </div>

                {/* Action */}
                <div className="mt-3 sm:mt-4">
                  {isApplied ? (
                    <div className="w-full py-2.5 text-sm font-medium text-center text-[#10B981] bg-[#10B981]/10 rounded-xl flex items-center justify-center gap-2">
                      <CheckIcon size={16} />
                      {opportunity.type === 'Scholarship' ? 'Applied' : 'Claimed'}
                    </div>
                  ) : (
                    <DiravButton
                      label={opportunity.type === 'Scholarship' ? 'Apply Now' : 'Claim Discount'}
                      fullWidth
                      size="sm"
                      isOutlined
                      onClick={() => setSelectedOpportunity(opportunity)}
                    />
                  )}
                </div>
              </div>
            </DiravCard>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredOpportunities.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-semibold text-[#111827] mb-2">
            No opportunities found
          </h3>
          <p className="text-[#6B7280]">
            Try selecting a different category
          </p>
        </div>
      )}

      {/* Opportunity Detail Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-lg shadow-xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <DiravBadge
                label={selectedOpportunity.type}
                color={
                  selectedOpportunity.type === 'Scholarship'
                    ? DiravColors.info
                    : DiravColors.warning
                }
                textColor="white"
              />
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <CloseIcon size={20} className="text-[#6B7280]" />
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mb-2">
              {selectedOpportunity.title}
            </h2>
            <p className="text-[#6B7280] mb-4">{selectedOpportunity.vendor}</p>

            {/* Value */}
            <div className="bg-gradient-to-r from-[#7C3AED]/10 to-[#C026D3]/10 rounded-xl p-4 mb-4">
              <p className="text-sm text-[#6B7280] mb-1">
                {selectedOpportunity.type === 'Scholarship' ? 'Award Amount' : 'Discount'}
              </p>
              <p className="text-2xl font-bold text-[#7C3AED]">
                {formatValue(selectedOpportunity)}
              </p>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h4 className="font-medium text-[#111827] mb-2">Description</h4>
              <p className="text-sm text-[#6B7280]">{selectedOpportunity.description}</p>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <LocationIcon size={18} className="text-[#6B7280]" />
                <span className="text-[#111827]">
                  {selectedOpportunity.isOnline ? 'Available Online' : 'In-store Only'}
                </span>
              </div>
              {selectedOpportunity.expiryDate && (
                <div className="flex items-center gap-3 text-sm">
                  <CalendarIcon size={18} className="text-[#6B7280]" />
                  <span className="text-[#111827]">
                    Expires: {formatDate(selectedOpportunity.expiryDate)}
                  </span>
                </div>
              )}
            </div>

            {/* Link */}
            <div className="bg-gray-50 rounded-xl p-3 mb-6 flex items-center gap-2">
              <input
                type="text"
                value={selectedOpportunity.link}
                readOnly
                className="flex-1 bg-transparent text-sm text-[#6B7280] truncate"
              />
              <button
                onClick={() => handleCopyLink(selectedOpportunity.link)}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <CopyIcon size={18} className="text-[#6B7280]" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <DiravButton
                label="Visit Website"
                isOutlined
                fullWidth
                onClick={() => handleOpenLink(selectedOpportunity.link)}
              />
              <DiravButton
                label={selectedOpportunity.type === 'Scholarship' ? 'Apply' : 'Claim'}
                fullWidth
                onClick={() => handleApply(selectedOpportunity)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OpportunitiesScreen;
