module.exports = async (client) => {
  const fullList = await client.db.get("playlist")
  if (!fullList) return client.db.set(`playlist.pid_thedreamvastghost0923849084`, {
      id: "thedreamvastghost0923849084",
      name: "TheDreamvastGhost",
      owner: client.owner,
      tracks: [],
      private: true,
      created: Date.now(),
      description: null,
  })

  const code = client.db.get("code")

  if (!code) await client.db.set(`code.pmc_thedreamvastghost`, {
    code: "pmc_thedreamvastghost",
    plan: null,
    expiresAt: null
})
}