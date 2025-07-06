/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from "bcrypt";
import { model, ObjectId, Schema } from "mongoose";
import config from "../../../config";
import { IUserSchema, UserModel } from "./user.interface";

const UserSchema = new Schema<IUserSchema, UserModel>(
	{
		email: {
			type: String,
			unique: true,
			required: true,
			trim: true,
		},
		username: {
			type: String,
			trim: true,
			required: true,
		},
		password: {
			type: String,
			trim: true,
			required: true,
		},
		refreshToken: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

//hash password
UserSchema.pre("save", async function (next) {
	const user = this;

	user.password = await bcrypt.hash(
		user.password as string,
		Number(config.bcrypt_salt_round)
	);

	next();
});

/* check user exist or not */
UserSchema.static(
	"isUserExists",
	async function (obj: {
		_id?: ObjectId;
		email?: string;
	}): Promise<Pick<
		IUserSchema,
		"_id" | "username" | "email" | "password"
	> | null> {
		return this.findOne(obj, {
			_id: 1,
			password: 1,
			username: 1,
			email: 1,
			roles: 1,
		}).lean();
	}
);

/* check password match or not */
UserSchema.static(
	"isPasswordMatch",
	async function (
		givenPassword: string,
		savedPassword: string
	): Promise<boolean> {
		return await bcrypt.compare(givenPassword, savedPassword);
	}
);

export const User = model<IUserSchema, UserModel>("Users", UserSchema);
