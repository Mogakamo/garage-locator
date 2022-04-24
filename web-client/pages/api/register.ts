import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

export default async (req, res) => {
  if (req.method === "POST") {
    const { firstName, lastName, email, password, userType } = req.body;

    try {
      const hash = await bcrypt.hash(password, 0);
      await prisma.users.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hash,
          userType: userType,
        },
      });

      return res.status(200).json();
    } catch (err) {
        return res.status(503).json({err: err.toString()});
    }
  }
  else {
    return res.status(405).json({error: "This request supports POST requests only"});
  }
};
