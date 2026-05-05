import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "./supabase";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const { data: loggedInUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_user_id", user.id)
      .single();

    if (loggedInUser) {
      return loggedInUser;
    }

    if (findError && findError.code !== "PGRST116") {
      // PGRST116 is "JSON object requested, multiple (or no) rows returned"
      // If it's a different error, log it
      console.error("Error finding user:", findError);
    }

    const name = `${user.firstName} ${user.lastName}`;

    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({
        clerk_user_id: user.id,
        name,
        image_url: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating user:", createError);
      return null;
    }

    return newUser;
  } catch (error) {
    console.error("Unexpected error in checkUser:", error.message);
    return null;
  }
};