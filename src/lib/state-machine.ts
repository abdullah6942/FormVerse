import { AppState, StateTransitions, type StateLog } from '@/types';

/**
 * State Machine Manager
 * Handles state transitions with validation and logging
 */
export class StateMachine {
  private currentState: AppState;
  private stateHistory: StateLog[] = [];

  constructor(initialState: AppState = AppState.INTERVIEWING) {
    this.currentState = initialState;
    this.logStateChange(initialState, initialState, { reason: 'initialization' });
  }

  /**
   * Get the current state
   */
  getState(): AppState {
    return this.currentState;
  }

  /**
   * Check if a transition is valid
   */
  canTransition(toState: AppState): boolean {
    const allowedTransitions = StateTransitions[this.currentState];
    return allowedTransitions.includes(toState);
  }

  /**
   * Transition to a new state
   */
  transition(toState: AppState, metadata?: Record<string, any>): boolean {
    // Allow staying in the same state (idempotent transitions)
    if (this.currentState === toState) {
      console.log(`[State Machine] Already in state ${toState}, skipping transition`);
      return true;
    }
    
    if (!this.canTransition(toState)) {
      console.error(
        `Invalid transition from ${this.currentState} to ${toState}. ` +
        `Allowed transitions: ${StateTransitions[this.currentState].join(', ')}`
      );
      return false;
    }

    const fromState = this.currentState;
    this.currentState = toState;
    this.logStateChange(fromState, toState, metadata);
    
    return true;
  }

  /**
   * Log a state change
   */
  private logStateChange(from: AppState, to: AppState, metadata?: Record<string, any>): void {
    const log: StateLog = {
      from,
      to,
      timestamp: new Date(),
      metadata,
    };
    this.stateHistory.push(log);
    
    console.log('[State Machine]', {
      transition: `${from} → ${to}`,
      timestamp: log.timestamp.toISOString(),
      metadata,
    });
  }

  /**
   * Get state history
   */
  getHistory(): StateLog[] {
    return [...this.stateHistory];
  }

  /**
   * Reset to initial state
   */
  reset(): void {
    this.currentState = AppState.INTERVIEWING;
    this.stateHistory = [];
    this.logStateChange(AppState.INTERVIEWING, AppState.INTERVIEWING, { reason: 'reset' });
  }

  /**
   * Get allowed transitions from current state
   */
  getAllowedTransitions(): AppState[] {
    return StateTransitions[this.currentState];
  }
}
