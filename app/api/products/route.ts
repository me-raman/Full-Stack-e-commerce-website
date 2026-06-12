import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gender = searchParams.get("gender");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");

    let query = supabase.from("products").select("*").eq("is_active", true);

    if (gender) query = query.eq("gender", gender);
    if (category) query = query.eq("category", category);
    if (minPrice) query = query.gte("price", Number(minPrice));
    if (maxPrice) query = query.lte("price", Number(maxPrice));
    if (featured === "true") query = query.eq("is_featured", true);

    if (sort === "price_asc") {
      query = query.order("price", { ascending: true });
    } else if (sort === "price_desc") {
      query = query.order("price", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    if (limit) query = query.limit(Number(limit));

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      products: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Admin auth check
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (token !== "tilaak-admin-authenticated") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate required fields
    const required = ["name", "description", "price", "category", "gender"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert({
        name: body.name,
        description: body.description,
        price: Number(body.price),
        original_price: Number(body.original_price) || Number(body.price),
        category: body.category,
        gender: body.gender,
        sizes: body.sizes || [],
        colors: body.colors || [],
        images: body.images || [],
        stock: Number(body.stock) || 0,
        is_featured: body.is_featured || false,
        is_active: body.is_active !== undefined ? body.is_active : true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ product: data });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
