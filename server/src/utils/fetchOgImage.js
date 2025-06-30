import ogs from 'open-graph-scraper'

export const fetchOgImage = async (url) => {
  try {
    const { result } = await ogs({ url })

    const image = result.ogImage?.url || result.ogImage?.[0]?.url || null
    return image

  } catch (err) {
    console.error("Error fetching OG image:", err)
    return null
  }
}
