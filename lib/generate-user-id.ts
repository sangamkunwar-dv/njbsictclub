/**
 * Generates a unique user ID in the format NJBS-XXXXXXXX
 * NJBS = Club prefix
 * XXXXXXXX = 7-digit random number
 */
export function generateUserID(): string {
  const randomNumber = Math.floor(Math.random() * 10000000)
    .toString()
    .padStart(7, '0')
  return `NJBS-${randomNumber}`
}

/**
 * Validates if a user ID is in the correct format
 */
export function isValidUserID(id: string): boolean {
  return /^NJBS-\d{7}$/.test(id)
}
