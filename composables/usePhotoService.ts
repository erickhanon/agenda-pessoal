export function usePhotoService(token: string) {
  const getPhoto = async (contactId: number): Promise<string | null> => {
    try {
      const response = await fetch(`https://demometaway.vps-kinghost.net:8485/api/foto/download/${contactId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Erro ao buscar a foto')
      }
      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      return imageUrl
    } catch (error) {
      console.error('Erro ao buscar a foto:', error)
      return null
    }
  }

  return {
    getPhoto
  }
}
