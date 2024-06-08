export function usePhotoService(token: string) {
  const apiUrl = "https://demometaway.vps-kinghost.net:8485";
  const getPhoto = async (contactId: number): Promise<string | null> => {
    try {
      const response = await fetch(`${apiUrl}/api/foto/download/${contactId}`, {
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

  const uploadPhoto = async (contactId: number, formData: FormData) => {
    const response = await fetch(`${apiUrl}/api/foto/upload/${contactId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return response;
  };

  return {
    uploadPhoto, getPhoto
  };
  
}
