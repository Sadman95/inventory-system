import { Document, Types } from "mongoose";

export interface ICategory extends Document {
	name: string;
	createdAt: Date;
	updatedAt: Date;
}
