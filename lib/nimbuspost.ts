const BASE_URL = "https://api.nimbuspost.com/v1";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken() {
    if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.token;

    const res = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: process.env.NIMBUSPOST_EMAIL,
            password: process.env.NIMBUSPOST_PASSWORD,
        }),
    });

    if (!res.ok) throw new Error(`NimbusPost login failed: ${res.status}`);
    const data = await res.json();

    // Token is valid ~24h; cache for 23h to be safe.
    cachedToken = { token: data.data, expiresAt: Date.now() + 23 * 60 * 60 * 1000 };
    return cachedToken.token;
}

type ShipmentItem = {
    name: string;
    qty: number;
    price: number;
};

type ShipmentInput = {
    orderId: string; // your internal order id, sent as order_number
    paymentType: "prepaid" | "cod";
    consignee: {
        name: string;
        phone: string;
        line1: string;
        line2?: string;
        city: string;
        state: string;
        pincode: string;
    };
    items: ShipmentItem[];
    totalAmount: number;
    weightGrams: number; // sum of item weights
};

export async function checkServiceability(pincode: string, weightGrams: number) {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/courier/serviceability`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            origin: process.env.NIMBUSPOST_PICKUP_PINCODE,
            destination: pincode,
            payment_type: "prepaid",
            order_amount: 0,
            weight: weightGrams,
        }),
    });
    return res.json();
}

export async function createShipment(input: ShipmentInput) {
    const token = await getToken();

    const res = await fetch(`${BASE_URL}/shipments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            order_number: input.orderId,
            payment_type: input.paymentType,
            order_amount: input.totalAmount,
            package_weight: input.weightGrams,
            consignee: input.consignee.name,
            consignee_address: input.consignee.line1,
            consignee_address_2: input.consignee.line2 ?? "",
            consignee_city: input.consignee.city,
            consignee_state: input.consignee.state,
            consignee_pincode: input.consignee.pincode,
            consignee_phone: input.consignee.phone,
            pickup: process.env.NIMBUSPOST_PICKUP_LOCATION_ID,
            order_items: input.items.map((item) => ({
                name: item.name,
                qty: item.qty,
                price: item.price,
            })),
        }),
    });

    if (!res.ok) throw new Error(`NimbusPost shipment creation failed: ${res.status}`);
    return res.json(); // includes awb_number, courier_name, etc.
}

export async function trackShipment(awb: string) {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/shipments/track/${awb}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
}