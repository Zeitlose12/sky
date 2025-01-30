import { fail, redirect } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { schema } from "../schema";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async () => {
  redirect(308, "/");
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    const form = await superValidate(request, zod(schema));

    if (!form.valid) {
      console.error(form.errors);
      return fail(400, {
        searchForm: form
      });
    }

    try {
      const response = await fetch(`/api/uuid/${form.data.query}`);
      if (response.status === 204 || response.status === 404) {
        return message(form, { type: "error", text: `No user with the name '${form.data.query}' was found` }, { status: 404 });
      }

      const data = await response.json();
      if (data.errorMessage) {
        return message(form, { type: "error", text: `No user with the name '${form.data.query}' was found` }, { status: 404 });
      }
    } catch (error) {
      console.error(error);
      return message(form, { type: "error", text: "An error occurred while fetching the user data" }, { status: 500 });
    }

    redirect(303, `/stats/${form.data.query}`);
  }
};
