export async function POST(req: Request) {
  const formData = await req.formData();
  const audio = formData.get("audio") as Blob;

  if (!audio) return Response.json({ text: "" });

  const efForm = new FormData();
  efForm.append("audio", audio, "audio.webm");
  efForm.append("model_id", "scribe_v1");

  const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY ?? "" },
    body: efForm,
  });

  if (!res.ok) return Response.json({ text: "" });

  const data = await res.json();
  return Response.json({ text: data.text ?? "" });
}
