(() => {
  let btnToken = document.getElementById("btnToken");
  let tokenVal = document.getElementById("authtoken");

  const authtoken = localStorage.getItem("authtoken");
  if (authtoken !== null) {
    tokenVal.value = authtoken;
  }

  btnToken.addEventListener("click", () => {
    let data = {
      authtoken: tokenVal.value,
    };

    localStorage.setItem("authtoken", data.authtoken);
    window.close();
  });
})();
