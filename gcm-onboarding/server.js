const express = require("express");
const clientRoutes = require("./routes/client_onboarding");
const serviceRoutes = require("./routes/service_onboarding");

const port = 3008;

const app = express();

app.use(express.json());

app.use("/onboard/client/config", clientRoutes);

app.use("/v1/service/config", serviceRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
