import { useEffect, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
} from "react-icons/fa";
import { PROFILE_IMAGE } from "../constants";
import { defaultStories } from "../data/storiesData";
import StoryViewer from "./StoryViewer";
import StoryCreator from "./StoryCreator";

function createTextStory(id, text) {
  return {
    id,
    name: "สตอรี่ของคุณ",
    text: text.trim(),
    avatar: PROFILE_IMAGE,
    type: "text",
  };
}

function createImageStory(id, image) {
  return {
    id,
    name: "สตอรี่ของคุณ",
    image,
    avatar: PROFILE_IMAGE,
    type: "image",
  };
}

function Stories() {
  const [stories, setStories] = useState(defaultStories);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [viewedStoryIds, setViewedStoryIds] = useState([]);

  const storiesRef = useRef(null);
  const scrollTimerRef = useRef(null);
  const nextStoryIdRef = useRef(Math.max(...defaultStories.map((story) => story.id), 0) + 1);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);

  useEffect(() => () => {
    window.clearTimeout(scrollTimerRef.current);
  }, []);

  function addImageStory(imageData) {
    setStories((currentStories) => [
      createImageStory(nextStoryIdRef.current++, imageData),
      ...currentStories,
    ]);
  }

  function addTextStory(text) {
    setStories((currentStories) => [
      createTextStory(nextStoryIdRef.current++, text),
      ...currentStories,
    ]);
  }

  function updateButtons() {
    const track = storiesRef.current;
    if (!track) return;
    setShowPrev(track.scrollLeft > 0);
    setShowNext(track.scrollLeft < track.scrollWidth - track.clientWidth - 5);
  }

  function scrollNext() {
    storiesRef.current?.scrollBy({ left: 420, behavior: "smooth" });
    window.clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = window.setTimeout(updateButtons, 350);
  }

  function scrollPrev() {
    storiesRef.current?.scrollBy({ left: -420, behavior: "smooth" });
    window.clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = window.setTimeout(updateButtons, 350);
  }

  function openStory(story) {
    setSelectedStory(story);
    setViewedStoryIds((currentIds) => (
      currentIds.includes(story.id) ? currentIds : [...currentIds, story.id]
    ));
  }

  return (
    <>
      <section className="stories" aria-label="Stories">
        {showPrev && (
          <button type="button" className="stories__prev" onClick={scrollPrev}>
            <FaChevronLeft />
          </button>
        )}
        
        <div className="stories__track" ref={storiesRef} onScroll={updateButtons}>
          {/* การ์ดสร้างสตอรี่ */}
          <button
            type="button"
            className="story-card story-card--create"
            onClick={() => setIsCreatorOpen(true)}
          >
            <img src={PROFILE_IMAGE} alt="Create story" />
            <div className="story-card__create">
              <span><FaPlus /></span>
            </div>
            <strong>สร้างสตอรี่</strong>
          </button>

          {/* รายการสตอรี่ */}
          {stories.map((story) => (
            <article
              className={`story-card${story.type === "text" ? " story-card--text" : ""}${viewedStoryIds.includes(story.id) ? " story-card--viewed" : ""}`}
              key={story.id}
              role="button"
              tabIndex={0}
              onClick={() => openStory(story)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openStory(story);
                }
              }}
            >
              {story.type === "text" ? (
                <div className="story-card__text">{story.text}</div>
              ) : (
                <img src={story.image} alt={story.name} />
              )}
              <img src={story.avatar} alt="avatar" className="story-card__avatar" />
              <strong>{story.name}</strong>
            </article>
          ))}
        </div>

        {showNext && (
          <button type="button" className="stories__next" onClick={scrollNext}>
            <FaChevronRight />
          </button>
        )}
      </section>

      {/* Story Viewer */}
      <StoryViewer
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />

      {/* Story Creator */}
      {isCreatorOpen && (
        <StoryCreator
          onAddImageStory={addImageStory}
          onAddTextStory={addTextStory}
          onClose={() => setIsCreatorOpen(false)}
        />
      )}
    </>
  );
}

export default Stories;
