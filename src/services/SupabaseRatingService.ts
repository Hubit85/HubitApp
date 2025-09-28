import { supabase } from "@/integrations/supabase/client";
import {
  Contract,
  Profile,
  Property,
  Quote,
  Rating,
} from "@/integrations/supabase/types"

type RatingWithRaterProfile = Rating & {
  profiles: Profile
}

type ContractWithDetails = Contract & {
  properties: Property
  quotes: Quote
  profiles: Profile
}

export const supabaseRatingService = {
  async getAverageRatingForUser(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from("ratings")
      .select("rating")
      .eq("rated_id", userId)

    if (error) throw error

    if (!data || data.length === 0) {
      return 0
    }

    const totalRating = data.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0)
    return totalRating / data.length
  },

  async submitRating(ratingData: Rating) {
    const { data, error } = await supabase
      .from("ratings")
      .insert(ratingData)
      .select()
      .single()

    if (error) throw error
    return data
  },
}
