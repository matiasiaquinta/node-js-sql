import { Router } from "express";
import { loginUser, newUser } from "../controllers/user.controller";

const app = Router();

app.post('/', newUser);
app.post('/login', loginUser);

export default app;