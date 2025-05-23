import { SignUpSchema } from "@/lib/schema";
import db from "@/lib/db/db";
import { executeAction } from "@/lib/executeAction";

const signUp = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      const name = formData.get("name");
      const username = formData.get("username");
      const password = formData.get("password");
      const userType = formData.get("userType");

      
      const validatedData = SignUpSchema.parse({ username, password, name, userType });
      await db.user.create({
        data: {
          fullName: validatedData.name,
          userType: validatedData.userType,
          username: validatedData.username.toLocaleLowerCase(),
          password: validatedData.password,
        },
      });
    },
    successMessage: "Signed up successfully",
  });
};

export { signUp };
