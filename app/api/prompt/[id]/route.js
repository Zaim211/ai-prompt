import { connectToDB } from '@utils/database';
import Prompt from '@models/prompt';

// Get (read)
export const GET = async (req, { params }) => {
    try {
        await connectToDB();

        const prompts = await Prompt.findById(params.id).populate('creator');

        if(!prompts) return new Response("Prompts not found", { status: 404})

        return new Response(JSON.stringify(prompts), {status: 200})
    } catch (err) {
       return new Response('Failed to all prompts', {status: 500})
    }
}

// PATCH (update)
export const PATCH = async (req, {params}) => {
    const { prompt, tag} = await req.json();

    try {
        await connectToDB();

        const existingPrompt = await Prompt.findById(params.id);

        if(!existingPrompt) return new Response("Prompt not found", { status: 404 })

        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;
        await existingPrompt.save()

        return new Response(JSON.stringify(existingPrompt), { status: 200 })
    } catch (error) {
        return new Response('Failed to update prompt', { status: 500})
    }
}

//DELETE (delete)
export const DELETE = async (req, {params}) => {
    try {
        await connectToDB();
        // Find the prompt by ID and remove it
        await Prompt.findByIdAndRemove(params.id);

        return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
        return new Response("Error deleting prompt", { status: 500 });
    }
}