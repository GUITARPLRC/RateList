type BadgeTypes =
  | "rocket"
  | "medal"
  | "gem"
  | "trophy"
  | "mountain"
  | "flower"
  | "castle"
  | "blocks"
  | "crown"

interface Badge {
  id: string
  userId: string
  type: BadgeTypes
  created_at: string
}

type HowToGetBadgeTypes =
  | "firstList" // blocks
  | "completedProfile" // trophy
  | "betaUser" // medal
  | "premiumUser" // gem
  | "firstRating" // crown
  | "deleteList" // rocket

type checkBadgesArgs = "addList" | "deleteList" | "updatedProfile" | "addRating"
