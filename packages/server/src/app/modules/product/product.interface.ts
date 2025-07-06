import { Document, Types } from "mongoose";

export interface IProduct extends Document {
	barcode: string;
	material: number;
	description: string;
	categoryId: Types.ObjectId;
	addedAt: Date;
	updatedAt: Date;
}
