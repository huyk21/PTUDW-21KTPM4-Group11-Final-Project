async function loadData() {
  try {
    const response = await fetch("/loaddata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    let featureCollection = {
      type: "FeatureCollection",
      features: data.map((feature) => {
        const { type, geometry, ...properties } = feature;
        return {
          type: "Feature",
          geometry: geometry,
          properties: properties,
        };
      }),
    };

    console.log(featureCollection);
    return JSON.stringify(featureCollection);
  } catch (error) {
    console.error(error);
    // Depending on how you want to handle errors, you might want to rethrow the error
    // or return a default value like null or {}.
    return null;
  }
}
