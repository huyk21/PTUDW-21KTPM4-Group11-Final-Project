async function laugh(e) {
  e.preventDefault();
  try {
    let res = await fetch("/api/login/", {
      method: "POST",
    });
    if (res.ok) {
      // If the server confirms the deletion, remove the row from the DOM
    } else {
      // Handle error - maybe show a message to the user
      console.log("huhuhuhu");
    }
  } catch (error) {
    // Handle network errors
    console.log("huhuhuhu hihihihhihi");
  }
}
