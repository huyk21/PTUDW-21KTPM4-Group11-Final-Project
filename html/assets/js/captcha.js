if (document.getElementById("reportForm") != null) {
  document
    .getElementById("closeReportFormButton")
    .addEventListener("click", handleClose);
}
function handleClose() {
  resetForm();
  toggleSubmitButton(false);
}

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
      Swal.fire({
        title: "Thành công!",
        text: "Xác nhập captcha thành công!",
        icon: "success",
        confirmButtonText: "OK",
      });
      toggleSubmitButton(true);
    } else {
      Swal.fire({
        title: "Thất bại!",
        text: `Xác nhận captcha thất bại!`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error);
    Swal.fire({
      title: "Thất bại!",
      text: `Đăng nhập thất bại!`,
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}

// Function to enable or disable the submit button based on captcha verification
function toggleSubmitButton(enabled) {
  const submitButton = document.getElementById("submitButton");
  submitButton.disabled = !enabled;
}

// Function to reset the form
function resetForm() {
  document.getElementById("reportForm").reset(); // Reset the form
}
