"use client"

export function useSound() {
  const playSound = (sound: string) => {
    try {
      const audio = new Audio(`/sounds/${sound}.mp3`)
      audio.volume = 0.5
      audio.play().catch((e) => {
        console.log("Audio play prevented:", e)
      })
    } catch (error) {
      console.error("Error playing sound:", error)
    }
  }

  return playSound
}
