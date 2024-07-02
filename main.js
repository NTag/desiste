fetch("https://legislatives.fly.dev/")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });
