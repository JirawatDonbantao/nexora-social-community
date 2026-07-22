// src/pages/Home.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Input from "../components/Input";
import Sidebar from "../components/Sidebar";
import Stories from "../components/Stories";
import Post from "../components/Post";
import PostModal from "../components/PostModal";
import ContactsSidebar from "../components/ContactsSidebar";
import { PROFILE_NAME } from "../constants";

const initialNow = Date.now();

function createPost(nextId, { title = "", image = "", isShared = false, sharedFrom = null }) {
  return {
    id: nextId,
    title: title.trim(),
    image: image || "",
    createdAt: Date.now(),
    reaction: null,
    baseReactionCount: 0,
    comments: [],
    shareCount: 0,
    isShared,
    sharedFrom,
  };
}

function createComment(id, text) {
  return {
    id,
    text: text.trim(),
    createdAt: Date.now(),
    reaction: null,       // reactionId ที่ user เลือกสำหรับคอมเม้นนี้
    reactionCount: 0,     // จำนวน reaction พื้นฐาน
    replies: [],          // array ของ reply objects
  };
}

function createReply(id, text) {
  return {
    id,
    text: text.trim(),
    createdAt: Date.now(),
    reaction: null,
    reactionCount: 0,
  };
}

function Home({ searchQuery, showToast }) {
  const [posts, setPosts] = useState([]);
  const [now, setNow] = useState(initialNow);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const nextPostIdRef = useRef(1);
  const nextCommentIdRef = useRef(1);
  const nextReplyIdRef = useRef(1);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const addPost = useCallback((newPost) => {
    if (!newPost.title.trim() && !newPost.image) return;
    const post = createPost(nextPostIdRef.current++, newPost);
    setPosts((currentPosts) => [post, ...currentPosts]);
  }, []);

  const removePost = useCallback((postId) => {
    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
  }, []);

  const setReaction = useCallback((postId, reactionId) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, reaction: post.reaction === reactionId ? null : reactionId } : post
      )
    );
  }, []);

  const addComment = useCallback((postId, commentText) => {
    if (!commentText.trim()) return;
    const comment = createComment(nextCommentIdRef.current++, commentText);
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );
  }, []);

  // ── ใหม่: ตอบกลับคอมเม้น ──
  const addReply = useCallback((postId, commentId, replyText) => {
    if (!replyText.trim()) return;
    const reply = createReply(nextReplyIdRef.current++, replyText);
    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, replies: [...(comment.replies || []), reply] }
              : comment
          ),
        };
      })
    );
  }, []);

  // ── ใหม่: reaction บนคอมเม้น ──
  const setCommentReaction = useCallback((postId, commentId, reactionId) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, reaction: comment.reaction === reactionId ? null : reactionId }
              : comment
          ),
        };
      })
    );
  }, []);

  // ── ใหม่: reaction บน reply ──
  const setReplyReaction = useCallback((postId, commentId, replyId, reactionId) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map((comment) => {
            if (comment.id !== commentId) return comment;
            return {
              ...comment,
              replies: (comment.replies || []).map((reply) =>
                reply.id === replyId
                  ? { ...reply, reaction: reply.reaction === reactionId ? null : reactionId }
                  : reply
              ),
            };
          }),
        };
      })
    );
  }, []);

  const sharePost = useCallback((postId) => {
    setPosts((currentPosts) => {
      const originalPost = currentPosts.find((p) => p.id === postId);
      if (!originalPost) return currentPosts;
      const sharedPost = createPost(nextPostIdRef.current++, {
        isShared: true,
        sharedFrom: { title: originalPost.title, image: originalPost.image, createdAt: originalPost.createdAt, author: PROFILE_NAME },
      });
      return [
        sharedPost,
        ...currentPosts.map((p) => p.id === postId ? { ...p, shareCount: p.shareCount + 1 } : p)
      ];
    });
  }, []);

  const onCopyLink = useCallback(() => {
    showToast("ลิงก์โพสต์ยังไม่พร้อมใช้งานในเวอร์ชันเดโม");
  }, [showToast]);

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("th-TH");
  const filteredPosts = normalizedQuery
    ? posts.filter((post) => {
        const searchableText = [post.title, post.sharedFrom?.title]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase("th-TH");
        return searchableText.includes(normalizedQuery);
      })
    : posts;

  const activeModalPost = posts.find((p) => p.id === selectedPostId);

  return (
    <div className="main_content">
      <Sidebar />

      <div className="post_section">
        <Input addPost={addPost} />
        <Stories />

        {filteredPosts.map((post) => (
          <Post
            key={post.id}
            post={post}
            now={now}
            removePost={removePost}
            setReaction={setReaction}
            sharePost={sharePost}
            onCopyLink={onCopyLink}
            onOpenModal={setSelectedPostId}
          />
        ))}

        {normalizedQuery && filteredPosts.length === 0 && (
          <div className="search-empty" role="status">
            ไม่พบโพสต์ที่ตรงกับ “{searchQuery.trim()}”
          </div>
        )}
      </div>

      <ContactsSidebar searchQuery={searchQuery} />

      {activeModalPost && (
        <PostModal
          post={activeModalPost}
          now={now}
          closeModal={() => setSelectedPostId(null)}
          setReaction={setReaction}
          addComment={addComment}
          addReply={addReply}
          setCommentReaction={setCommentReaction}
          setReplyReaction={setReplyReaction}
          sharePost={sharePost}
          onCopyLink={onCopyLink}
        />
      )}
    </div>
  );
}

Home.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  showToast: PropTypes.func.isRequired,
};

export default Home;
