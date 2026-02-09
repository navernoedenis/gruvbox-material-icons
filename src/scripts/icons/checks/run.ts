import { yellow } from '../../helpers/painter';
import { check as checkAvailability } from './checkIconAvailability';
import { check as checkIconConflicts } from './checkIconConflicts';
import { check as checkIconUsage } from './checkIconUsage';

console.log('> Gruvbox Material Icons:', yellow('Running icon checks...'));
checkAvailability();
checkIconUsage();
checkIconConflicts();
