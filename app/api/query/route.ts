import { runQuery } from "@/src/lib/db";

export async function GET() {
  try {
    const data = await runQuery("SELECT * FROM foods");
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, error: error}, { status: 500 });
  }
}

export async function POST(request: Request) {  
  try {
    const order = await request.json();
    const insertQuery = `
      INSERT INTO orders (name, email, street, postalcode, city, pricetotal, cartdetails)
      VALUES (
        '${order.name}', '${order.email}', '${order.street}', '${order.postalcode}', 
        '${order.city}', ${order.pricetotal}, '${order.cartdetails}'
      )
    `;
    
    const result = await runQuery(insertQuery);
    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json({ success: false, error: error}, { status: 500 });
  }
}