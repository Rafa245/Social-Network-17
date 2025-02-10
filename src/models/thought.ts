import { Schema, Types, model, type Document } from 'mongoose';

interface IReaction extends Document {
    reactionId: Types.ObjectId;
    reactionBody: string;
    username: string;
    createdAt: Date;
}

interface IThought extends Document {
    thoughtText: string;
    createdAt: Date;
    username: string;
    reactions?: IReaction[];

    // Virtual field
    reactionCount?: number;
}

const reactionSchema = new Schema<IReaction>(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 128,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp: Date) => new Date(timestamp),
        }
    },
    {
        toJSON: { getters: true },
        _id: false,
    }
);

const thoughtSchema = new Schema<IThought>(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 128,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp: Date) => new Date(timestamp),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: { 
            virtuals: true, // Enable virtuals to be included in JSON output
            getters: true 
        },
    }
);

// 🔹 Add virtual for total reaction count
thoughtSchema.virtual('reactionCount').get(function (this: IThought) {
    return this.reactions ? this.reactions.length : 0;
});

const Thought = model<IThought>('Thought', thoughtSchema);

export default Thought;
