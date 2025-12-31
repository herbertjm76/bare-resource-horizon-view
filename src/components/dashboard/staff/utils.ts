import { StaffMember } from './types';
import { STAFF_THRESHOLDS } from './constants';
import { logger } from '@/utils/logger';

export const getProfileImage = (member: StaffMember): string => {
  // Check if member has an avatar image
  if (member.avatar_url) {
    return member.avatar_url;
  }
  
  // Use placeholder images as defaults based on name patterns
  // This is a simple approach - in a real app you'd have gender info or user uploads
  const firstName = (member.first_name || '').toLowerCase();
  const isFemale = firstName.includes('melody') || firstName.includes('sarah') || firstName.includes('emma') || firstName.includes('lisa');
  
  if (isFemale) {
    return 'https://images.unsplash.com/photo-1494790108755-2616c86b8e73?w=150&h=150&fit=crop&crop=face';
  } else {
    return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face';
  }
};

export const getInitials = (member: StaffMember): string => {
  const first = member.first_name || '';
  const last = member.last_name || '';
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
};

export const categorizeStaff = (staffData: StaffMember[]) => {
  const atCapacityStaff = staffData.filter(member => member.availability > STAFF_THRESHOLDS.AT_CAPACITY);
  const optimalStaff = staffData.filter(member => 
    member.availability > STAFF_THRESHOLDS.OPTIMAL_MIN && 
    member.availability <= STAFF_THRESHOLDS.OPTIMAL_MAX
  );
  const readyStaff = staffData.filter(member => member.availability <= STAFF_THRESHOLDS.READY_MAX);

  logger.debug('Staff categorization:', {
    atCapacity: atCapacityStaff.length,
    optimal: optimalStaff.length,
    ready: readyStaff.length,
    totalStaff: staffData.length
  });

  return {
    atCapacityStaff,
    optimalStaff,
    readyStaff,
  };
};
