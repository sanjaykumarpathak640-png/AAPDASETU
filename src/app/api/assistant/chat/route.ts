import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { message, currentPage, location } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const query = message.toLowerCase().trim();

    // Fetch quick live database facts to enrich answers
    const [shelters, alerts] = await Promise.all([
      prisma.shelter.findMany({ where: { operationalStatus: 'OPEN' }, take: 2 }),
      prisma.publicAlert.findMany({ where: { isPublished: true }, take: 1 }),
    ]);

    // Safety guardrails & fallback engine
    let reply = '';
    let actionLink = '';
    let actionText = '';

    if (query.includes('do right now') || query.includes('what should i do') || query.includes('emergency action')) {
      reply = `**Immediate Flood Safety Protocol:**
1. **Move Vertically:** If floodwater is rising around your building, move to the top floor or roof immediately. Do not stay in basements or ground rooms.
2. **Cut Utilities:** Shut off electrical mains and gas valves if safe to reach.
3. **Never Walk or Drive in Floodwater:** Just 15 cm (6 inches) of moving water can sweep an adult off their feet; 30 cm can float a vehicle.
4. **Locate High Ground:** Identify the nearest elevated shelter. If stranded, submit an emergency SOS immediately.`;
      actionLink = '/shelters';
      actionText = 'Find Safest Evacuation Shelter';
    } else if (query.includes('shelter') || query.includes('nearest shelter') || query.includes('safe place')) {
      const s = shelters[0];
      reply = `The currently recommended open shelter in the area is **${s?.name || 'Patna Community Hall Relief Center'}** (${s?.address || 'Near Digha Elevated Road'}).
- Available Beds: ${s?.availableBeds || 220}
- Food & Potable Water: ${s?.hasFood && s?.hasDrinkingWater ? 'Verified available' : 'Limited'}
- Medical Assistance: ${s?.hasMedical ? 'Available on-site' : 'Basic first-aid only'}

You can check distance, real-time occupancy percentage, and route recommendations on the Smart Shelter Finder.`;
      actionLink = '/shelters';
      actionText = 'Open Smart Shelter Finder';
    } else if (query.includes('pack') || query.includes('kit') || query.includes('checklist') || query.includes('prepare')) {
      reply = `**Emergency Go-Bag Essentials:**
- Drinking water (at least 3 liters per person)
- Non-perishable food / dry rations for 72 hours
- Essential prescription medicines & basic first-aid supplies
- Waterproof pouch for identity documents, Aadhaar cards, and insurance papers
- High-lumen torch / flashlight with spare batteries
- Fully charged power bank and phone cables
- Sturdy footwear, waterproof jacket, and hygiene supplies.`;
      actionLink = '/checklist';
      actionText = 'Open Flood Preparedness Checklist';
    } else if (query.includes('sos') || query.includes('trapped') || query.includes('help') || query.includes('rescue')) {
      reply = `🚨 **Emergency Assistance Procedure:**
If you or your family members are stranded or require urgent rescue, please file an official SOS request immediately.
- Responders will receive your GPS coordinates, group size, and vulnerability flags.
- **National Emergency Helpline:** Call **112** or District Disaster Operations at **1077**.
*(Note: AAPDASETU Assistant provides planning guidance; filing the SOS form or calling 112 alerts response teams).*`;
      actionLink = '/sos';
      actionText = 'Submit Emergency SOS Now';
    } else if (query.includes('warning') || query.includes('alert') || query.includes('why is my area')) {
      const a = alerts[0];
      reply = `**Current Warning Advisory:**
${a ? `**${a.title}**\n- **Affected Area:** ${a.area}\n- **Reason:** ${a.reason}\n- **Action:** ${a.recommendedAction}` : 'Standard monsoon vigilance is currently advised across river catchment lowlands.'}

Risk levels are calculated from localized rainfall (mm), river gauge sensors vs danger marks, distance to inundation plains, and road obstructions.`;
      actionLink = '/warnings';
      actionText = 'View Early Warning Center';
    } else if (query.includes('route') || query.includes('road') || query.includes('drive') || query.includes('navigate')) {
      reply = `**Safe Navigation Guidance:**
Never take low-lying riverfront bypasses during active inundation. Several roads (e.g. Old Digha Riverfront Link Road) are blocked with deep water.
Always utilize high-elevation arterial corridors and flyovers even if the distance is slightly longer. Check the Safe Route Planner for candidate routes evaluated against known hazards.`;
      actionLink = '/route';
      actionText = 'Plan Safe Route';
    } else if (query.includes('family') || query.includes('loved ones') || query.includes('circle')) {
      reply = `Use the **Family Safety** module to mark your safety status ("I'M SAFE" / "NEED HELP") and view the latest reported locations of your family circle. When offline, updates are queued locally and synchronized automatically.`;
      actionLink = '/family';
      actionText = 'View Family Safety Circle';
    } else if (query.includes('offline') || query.includes('no internet')) {
      reply = `AAPDASETU operates offline as a Progressive Web App! You can access previously cached shelters, emergency numbers (112, 1077, 108), your preparedness checklist, and draft offline SOS requests that send as soon as connection restores.`;
      actionLink = '/offline';
      actionText = 'Access Offline Emergency Mode';
    } else {
      reply = `I am the **AAPDASETU Safety Assistant**. I can help you with:
- Emergency flood response steps ("What should I do right now?")
- Finding verified shelters with available beds and drinking water
- Understanding warning levels and risk factors in your sector
- Preparing an emergency go-bag and checklist
- Submitting an emergency rescue SOS
- Safe evacuation navigation avoiding flooded roads

How can I assist your flood preparedness today?`;
      actionLink = '/dashboard';
      actionText = 'Go to Flood Safety Dashboard';
    }

    return NextResponse.json({
      reply,
      actionLink,
      actionText,
      source: 'AAPDASETU Local Safety Engine (Deterministic Fallback)',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

