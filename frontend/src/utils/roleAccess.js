/**
 * Centralized Role-Based UI Rules
 * --------------------------------
 * Roles supported:
 * - CITIZEN
 * - OFFICIAL
 * - ADMIN
 */

/* -------- ROLE CHECKERS -------- */

export const isCitizen = (user) => {
  return user?.role === "CITIZEN";
};

export const isOfficial = (user) => {
  return user?.role === "OFFICIAL";
};

export const isAdmin = (user) => {
  return user?.role === "ADMIN";
};

/* -------- PERMISSION RULES -------- */

/**
 * Citizens can vote
 */
export const canVote = (user) => {
  return isCitizen(user);
};

/**
 * Officials & Admins can create polls
 */
export const canCreatePoll = (user) => {
  return isOfficial(user) || isAdmin(user);
};

/**
 * Citizens cannot create polls
 */
export const cannotCreatePoll = (user) => {
  return isCitizen(user);
};

/**
 * Officials/Admins cannot vote
 */
export const cannotVote = (user) => {
  return isOfficial(user) || isAdmin(user);
};
