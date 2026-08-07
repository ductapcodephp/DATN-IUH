import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Custom hook for tracking video progress and preventing cheating.
 */
export const useProgressTracker = ({
    activeLesson,
    course,
    playerRef,
    localCompleted,
    localProgresses,
    setLocalProgresses,
    setLocalCompleted,
    setProgress,
    flattenedLessons
}) => {
    const [showCheatModal, setShowCheatModal] = useState(false);
    const [cheatMessage, setCheatMessage] = useState("");

    useEffect(() => {
        if (!activeLesson || activeLesson.type !== 'video' || !activeLesson.video) return;

        // Ensure the player is attached. We use a small timeout to let useVideoPlayer init it first
        const initTracker = () => {
            const player = playerRef.current;
            if (!player) return;

            let lastSentTime = 0;
            const isAlreadyCompleted = localCompleted.includes(activeLesson.id);
            let maxWatchedTime = isAlreadyCompleted 
                ? 999999 
                : (localProgresses[activeLesson.id]?.watched_seconds || 0);
            
            let totalSkipped = localProgresses[activeLesson.id]?.skipped_seconds || 0;
            const maxSkipPerSeek = 20; 
            const updateInterval = 10; 

            const onTimeUpdate = () => {
                if (!player) return;
                const currentTime = player.currentTime();
                const duration = player.duration();

                const maxTotalSkipAllowed = duration * 0.10;

                if (!player.seeking()) {
                    if (currentTime > maxWatchedTime && (currentTime - maxWatchedTime) < 2) {
                        maxWatchedTime = currentTime;
                    }
                } else {
                    const jump = currentTime - maxWatchedTime;
                    if (jump > 1) { 
                        if (jump > maxSkipPerSeek) {
                            player.currentTime(maxWatchedTime);
                            setCheatMessage(`Bạn chỉ được phép tua tối đa ${maxSkipPerSeek} giây mỗi lần!`);
                            setShowCheatModal(true);
                            return; 
                        }

                        if (totalSkipped + jump > maxTotalSkipAllowed) {
                            player.currentTime(maxWatchedTime);
                            setCheatMessage(`Bạn đã hết quyền tua! (Tối đa ${Math.floor(maxTotalSkipAllowed)} giây cho bài này). Tổng đã tua: ${totalSkipped}s.`);
                            setShowCheatModal(true);
                            return; 
                        }

                        totalSkipped += jump;
                        maxWatchedTime = currentTime;
                    }
                }

                let safeTime = Math.min(currentTime, maxWatchedTime);

                if (duration > 0 && (safeTime - lastSentTime >= updateInterval || safeTime === duration)) {
                    lastSentTime = safeTime;

                    axios.post(route('frontend.course.update_video_progress', {
                        slug: course.slug,
                        lessonId: activeLesson.id
                    }), {
                        watched_seconds: safeTime,
                        skipped_seconds: totalSkipped,
                        duration_seconds: duration
                    })
                    .then(response => {
                        const confirmedWatched = response.data.watched_seconds;
                        
                        setLocalProgresses(prev => ({
                            ...prev,
                            [activeLesson.id]: {
                                ...(prev[activeLesson.id] || {}),
                                watched_seconds: confirmedWatched
                            }
                        }));

                        if (duration > 0 && (confirmedWatched / duration) >= 0.7) {
                            setLocalCompleted(prev => {
                                if (!prev.includes(activeLesson.id)) {
                                    const newCompleted = [...prev, activeLesson.id];
                                    const totalLessons = flattenedLessons.length;
                                    if (totalLessons > 0) {
                                        setProgress(Math.round((newCompleted.length / totalLessons) * 100));
                                    }
                                    return newCompleted;
                                }
                                return prev;
                            });
                        }
                    })
                    .catch(err => console.error('Lỗi khi lưu tiến trình xem:', err));
                }
            };

            const onSeeking = () => {
                if (!player) return;
                const currentTime = player.currentTime();
                if (currentTime > maxWatchedTime) {
                    player.currentTime(maxWatchedTime);
                }
            };

            player.on('timeupdate', onTimeUpdate);
            player.on('seeking', onSeeking);

            return () => {
                if (player) {
                    player.off('timeupdate', onTimeUpdate);
                    player.off('seeking', onSeeking);
                }
            };
        };

        const timeoutId = setTimeout(initTracker, 100);
        return () => clearTimeout(timeoutId);
    }, [activeLesson, course.slug]);

    return { showCheatModal, cheatMessage, setShowCheatModal };
};
