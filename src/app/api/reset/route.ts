import { NextResponse } from "next/server";

import { neo4jSession } from "@/lib/config/db";

import { API_URL } from "@/lib/config/api_config";

/**
 * Reset Dev DB
 */
export async function POST() {
  try {
    ////////////////////////////////////////////////////////

    // 1. Delete Everything
    await neo4jSession.executeWrite((tx) => {
      return tx.run(/* cypher */ `
        MATCH (n)
        DETACH DELETE n
      `);
    });

    ////////////////////////////////////////////////////////

    // 2. Create Users

    // #1
    const philippeFanaroRes = await fetch(
      `${API_URL}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "philippe_fanaro",
          email: "philippe@fanaro.com",
        }),
      }
    );
    // #2
    const johnDoeRes = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "john_doe",
        email: "john@doe.com",
      }),
    });

    const philippeFanaroBody =
      await philippeFanaroRes.json();
    const johnDoeBody = await johnDoeRes.json();

    const philippeFanaroId =
      philippeFanaroBody.nodes.first().id;
    const johnDoeId = johnDoeBody.nodes.first().id;

    ////////////////////////////////////////////////////////

    // 3. Follows

    // #1
    await fetch(`${API_URL}/users/${johnDoeId}/follows`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        user_id: philippeFanaroId,
      },
      body: JSON.stringify({
        name: "philippe_fanaro",
        email: "philippe@fanaro.com",
      }),
    });

    ////////////////////////////////////////////////////////

    // 4. Items

    // #1
    const designingRes = await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        user_id: johnDoeId,
      },
      body: JSON.stringify({
        title: "Designing Data-Intensive Applications",
        content:
          "Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability. In addition, we have an overwhelming variety of tools, including relational databases, NoSQL datastores, stream or batch processors, and message brokers. What are the right choices for your application? How do you make sense of all these buzzwords?",
      }),
    });
    // #2
    const pyongYangRes = await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        user_id: johnDoeId,
      },
      body: JSON.stringify({
        title: "Pyongyang: A Journey in North Korea",
        content:
          'Famously referred to as one of the "Axis of Evil" countries, North Korea remains one of the most secretive and mysterious nations in the world today. In early 2001 cartoonist Guy Delisle became one of the few Westerners to be allowed access to the fortress-like country. While living in the nation\'s capital for two months on a work visa for a French film animation company, Delisle observed what he was allowed to see of the culture and lives of the few North Koreans he encountered; his findings form the basis of this graphic novel.\nGuy Delisle was born in Quebec City in 1966 and has spent the last decade living and working in the South of France with his wife and son. Delisle has spent ten years, mostly in Europe, working in animation, an experience that taught him about movement and drawing. He is now currently focusing on his cartooning. Delisle has written and drawn six graphic novels, including "Pyongyang," his first graphic novel in English.',
      }),
    });
    // #3
    const shenzhenRes = await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        user_id: johnDoeId,
      },
      body: JSON.stringify({
        title: "Shenzhen: A Travelogue from China",
        content:
          "Shenzhen is entertainingly compact with Guy Delisle's observations of life in urban southern China, sealed off from the rest of the country by electric fences and armed guards. With a dry wit and a clean line, Delisle makes the most of his time spent in Asia overseeing outsourced production for a French animation company. He brings to life the quick pace of Shenzhen's crowded streets. By translating his fish-out-of-water experiences into accessible graphic novels, Delisle skillfully notes the differences between Western and Eastern cultures, while also conveying his compassion for the simple freedoms that escape his colleagues in the Communist state.",
      }),
    });
    // #4
    const burmaRes = await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        user_id: johnDoeId,
      },
      body: JSON.stringify({
        title: "Burma Chronicles",
        content:
          "Burma Chronicles presents a personal and distinctively humorous glimpse into a political hotspot, putting a popular spin on current affairs.",
      }),
    });
    // #5
    const chroniquesRes = await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        user_id: johnDoeId,
      },
      body: JSON.stringify({
        title: "Chroniques de Jérusalem",
        content:
          "Guy Delisle et sa famille s’installent pour une année à Jérusalem. Pas évident de se repérer dans cette ville aux multiples visages, animée par les passions et les conflits depuis près de 4000 ans.\nAu détour d’une ruelle, à la sortie d’un lieu saint, à la terrasse d’un café, le dessinateur laisse éclater des questions fondamentales et nous fait découvrir un Jérusalem comme on ne l’a jamais vu.",
      }),
    });
    // #6
    const papierRes = await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        user_id: johnDoeId,
      },
      body: JSON.stringify({
        title: "Papier",
        content:
          "Papier, c'est une nouvelle revue de BD, composée de récits courts, publiés dans un petit format avec une grande diversité de styles et d'approches. Parmi les auteurs, des filles, des garçons, des jeunes, des vieux, des confirmés, des débutants, des Français mais aussi de nombreux auteurs internationaux à découvrir. Leur point commun ? Une vraie envie de s'amuser, d'expérimenter, de lâcher prise..",
      }),
    });
    // #7
    const systemRes = await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        user_id: philippeFanaroId,
      },
      body: JSON.stringify({
        title:
          "System Design Interview – An insider's guide",
        content:
          "The system design interview is considered to be the most complex and most difficult technical job interview by many. This book provides a step-by-step framework on how to tackle a system design question. It includes many real-world examples to illustrate the systematic approach with detailed steps that you can follow.",
      }),
    });
    // #8
    await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        user_id: philippeFanaroId,
      },
      body: JSON.stringify({
        title: "Les Pourquoi de l'histoire",
        content:
          "Savez-vous pourquoi Jésus n'est pas né en l'an 0 ? Pourquoi en 1582, nous sommes passés du 9 au 20 décembre en une seule nuit ? Pourquoi Henri IV s'est fait sacrer à Chartres ? Pourquoi Bonaparte a lancé l'expédition d'Egypte ? Pourquoi il y a plusieurs prétendants au trône de France ? Pourquoi le FBI doit sa fondation au petit neveu de Napoléon ? Pourquoi la Première Guerre mondiale n'est pas la première ? Ou pourquoi le président de la République française porte aussi le titre de co-prince ?Autant de questions que Stéphane Bern, pour qui l'Histoire n'a pas de secrets, nous invite à découvrir dans ce petit livre aussi ludique et surprenant qu'instructif.",
      }),
    });
    // #9
    await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        user_id: philippeFanaroId,
      },
      body: JSON.stringify({
        title: "Breath: The New Science of a Lost Art",
        content:
          "No matter what you eat, how much you exercise, how skinny or young or wise you are, none of it matters if you're not breathing properly.\nThere is nothing more essential to our health and well-being than breathing: take air in, let it out, repeat twenty-five thousand times a day. Yet, as a species, humans have lost the ability to breathe correctly, with grave consequences.",
      }),
    });

    const designingBody = await designingRes.json();
    const systemBody = await systemRes.json();
    const pyongYangBody = await pyongYangRes.json();
    const burmaBody = await burmaRes.json();
    const shenzhenBody = await shenzhenRes.json();
    const chroniquesBody = await chroniquesRes.json();
    const papierBody = await papierRes.json();

    const designingId = designingBody.nodes.first().id;
    const systemId = systemBody.nodes.first().id;
    const pyongYangId = pyongYangBody.nodes.first().id;
    const burmaId = burmaBody.nodes.first().id;
    const shenzhenId = shenzhenBody.nodes.first().id;
    const chroniquesId = chroniquesBody.nodes.first().id;
    const papierId = papierBody.nodes.first().id;

    ////////////////////////////////////////////////////////

    // 5. Connections

    // #1
    const relationConnection1Res = await fetch(
      `${API_URL}/items/${designingId}/connections/${systemId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          user_id: philippeFanaroId,
        },
        body: JSON.stringify({
          title: "Relation",
        }),
      }
    );
    // #2
    await fetch(
      `${API_URL}/items/${systemId}/connections/${designingId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          user_id: johnDoeId,
        },
        body: JSON.stringify({
          title: "Citation",
        }),
      }
    );
    // #3
    await fetch(
      `${API_URL}/items/${pyongYangId}/connections/${shenzhenId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          user_id: johnDoeId,
        },
        body: JSON.stringify({
          title: "Same Author",
        }),
      }
    );
    // #4
    await fetch(
      `${API_URL}/items/${pyongYangId}/connections/${shenzhenId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          user_id: johnDoeId,
        },
        body: JSON.stringify({
          title: "Both in Asia",
        }),
      }
    );
    // #5
    await fetch(
      `${API_URL}/items/${burmaId}/connections/${pyongYangId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          user_id: johnDoeId,
        },
        body: JSON.stringify({
          title: "Same Author",
        }),
      }
    );
    // #6
    await fetch(
      `${API_URL}/items/${shenzhenId}/connections/${chroniquesId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          user_id: johnDoeId,
        },
        body: JSON.stringify({
          title: "Same Author",
        }),
      }
    );
    // #7
    await fetch(
      `${API_URL}/items/${chroniquesId}/connections/${papierId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          user_id: johnDoeId,
        },
        body: JSON.stringify({
          title: "Same Author",
        }),
      }
    );

    const relationConnection1Body =
      await relationConnection1Res.json();

    const relationConnection1Id =
      relationConnection1Body.nodes.first().id;

    ////////////////////////////////////////////////////////

    // 6. Votes

    // #1
    await fetch(`${API_URL}/items/${designingId}/votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        user_id: philippeFanaroId,
      },
      body: JSON.stringify({
        points: 1,
      }),
    });
    // #2
    await fetch(`${API_URL}/items/${designingId}/votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        user_id: johnDoeId,
      },
      body: JSON.stringify({
        points: 1,
      }),
    });
    // #3
    await fetch(
      `${API_URL}/connections/${relationConnection1Id}/votes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          user_id: johnDoeId,
        },
        body: JSON.stringify({
          points: 1,
        }),
      }
    );

    ////////////////////////////////////////////////////////

    return new NextResponse("Reset DB Successfully", {
      status: 201,
    });
  } catch (e) {
    console.error(e);

    return new NextResponse("Error retrieving graph");
  }
}
