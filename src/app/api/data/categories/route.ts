import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: user, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("email", session.user.email)
            .single();

        if (userError || !user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Fetch user custom categories + system categories (user_id is null)
        const { data: categories, error } = await supabase
            .from("categories")
            .select("*")
            .or(`user_id.eq.${user.id},user_id.is.null`)
            .order("name", { ascending: true });

        if (error) {
            console.error("Error fetching categories:", error);
            return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
        }

        return NextResponse.json(categories);
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
