document.getElementById("captchaButton").addEventListener("click", runVerify);

async function runVerify(e) {
  e.preventDefault();
  await runCaptcha();
}

async function runCaptcha() {
  try {
    const token = await grecaptcha.execute(
      "6LeRskYpAAAAADHXmURgfhBeOBeH76B51U0NmJmj",
      { action: "login" }
    );
    const test = await sendData(token);
    console.log(test);
  } catch (error) {
    console.error("Error in runCaptcha:", error);
  }
}

async function sendData(captcha) {
  const info = JSON.stringify({ captcha: captcha });

  try {
    const response = await fetch("/api/captcha", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-type": "application/json",
      },
      body: info,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data.success) {
      alert("Xac thuc thanh cong! Score: " + data.score);
      toggleSubmitButton(true);
    } else {
      alert("Xac thuc that bai! " + (data.msg || "Unknown error"));
    }
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error);
    alert("Đăng nhập thất bại! " + error.message);
  }
}
// Function to enable or disable the submit button based on captcha verification
function toggleSubmitButton(enabled) {
  const submitButton = document.getElementById("submitButton");
  submitButton.disabled = !enabled;
}
