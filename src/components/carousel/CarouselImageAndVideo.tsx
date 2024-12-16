import  { useRef, useState } from "react";
import { Carousel, ConfigProvider, Image } from "antd";
import ReactPlayer from "react-player";
import { baseURL } from "../../api/interseptots";

interface Props {
  images: string[];
  video?: string;
}


const ProductItemByIdCarusel = ({ images, video }: Props) => {
  const playerRef = useRef<ReactPlayer>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleBeforeChange = (currentSlide: number) => {
    // Останавливаем видео, если переходим с видео слайда
    if (currentSlide === 0 && video) {
      setIsPlaying(false);
    }
  };

  const handleAfterChange = (nextSlide: number) => {
    // Запускаем видео, если переходим на видео слайд
    if (nextSlide === 0 && video) {
      setIsPlaying(true);
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Carousel: {
            arrowOffset: 3,
            arrowSize:32,
          },
        },
      }}
    >
      <Carousel
        draggable
        arrows
        swipe
        infinite={false}
        style={{ width: "100%", margin: "0 auto", textAlign: "center" }}
        beforeChange={handleBeforeChange}
        afterChange={handleAfterChange}
      >
        {video && (
          <div style={{ display: "inline", margin: "0 auto", height: "300px" }}>
            <ReactPlayer
              ref={playerRef}
              url={`${baseURL}${video}`}
              loop
              playing={isPlaying}
              controls
              width={285}
              height={285}
              style={{
                textAlign: "center",
                width: "100%",
                margin: "10px auto",
                height: "300px",
              }}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
            />
          </div>
        )}
        {images.map((image, index) => (
          <div style={{ display: "inline", margin: "0 auto" }} key={index}>
            <Image
              width={200}
              height={300}
              src={`${baseURL}/uploads/${image}`}
              className="text-center mx-auto my-auto py-4"
            />
          </div>
        ))}
      </Carousel>
    </ConfigProvider>
  );
};

export default ProductItemByIdCarusel;