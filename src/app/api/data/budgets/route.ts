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

        // Fetch budgets
        const { data: budgets, error } = await supabase
            .from("budgets")
            .select(`
                *,
                category:categories(name, icon, color)
            `)
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching budgets:", error);
            return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
        }

        // Calculate spent amount for each budget
        const budgetsWithSpent = await Promise.all(
            (budgets || []).map(async (budget: any) => {
                const { data: transactions } = await supabase
                    .from("transactions")
                    .select("amount")
                    .eq("user_id", user.id)
                    .eq("category_id", budget.category_id)
                    .eq("type", "EXPENSE")
                    .gte("date", budget.start_date)
                    .lte("date", budget.end_date || new Date().toISOString());

                const spent = (transactions as any[])?.reduce(
                    (sum, t) => sum + Math.abs(Number(t.amount)),
                    0
                ) || 0;

                const remaining = Number(budget.amount) - spent;
                const percentage = (spent / Number(budget.amount)) * 100;

                return {
                    ...budget,
                    spent,
                    remaining,
                    percentage,
                };
            })
        );

        return NextResponse.json(budgetsWithSpent);
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
