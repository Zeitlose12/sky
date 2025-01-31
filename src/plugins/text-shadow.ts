import plugin from "tailwindcss/plugin";

const textShadowPlugin = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      "text-shadow": (value) => ({
        textShadow: value
      })
    },
    { values: theme("textShadow") }
  );
});

export default textShadowPlugin;
