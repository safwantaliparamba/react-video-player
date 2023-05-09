import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import styled, { keyframes } from 'styled-components'

import playIcon from "../../assets/icons/play.svg"
import pauseIcon from "../../assets/icons/pause.svg"
import volumeUpIcon from "../../assets/icons/volume-full.svg"
import volumeDownIcon from "../../assets/icons/volume-down.svg"
import volumeOffIcon from "../../assets/icons/volume-off.svg"
import fowardIcon from "../../assets/icons/forward.svg"
import replayIcon from "../../assets/icons/replay.svg"



const PRIMARY_COLOR = "#32bcad"

function secondsToHms(d = 0) {
    d = +d;
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    // var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    // var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return h + m + s;
}

const VideoPlayer = () => {
    const videoRef = useRef()
    const [state, setState] = useState({
        seek: 0,
        loaded: 0,
        played: 0,
        duration: 0,
        muted: false,
        ended: false,
        playing: false,
        playedPercent: 0,
        buffering: false,
    })


    const VideoWrapper = useMemo(() => {
        return ({ children }) => {
            return <VideoParent>{children}</VideoParent>
        }
    }, [])

    const togglePlayHandler = () => {
        state.playing ? setState({ ...state, playing: false }) : setState({ ...state, playing: true, ended: false })
    }

    useEffect(() => {
        setState({ ...state, duration: videoRef?.current.getDuration() })
    }, [])

    const Loader = () => {
        return <LoaderWrapper> <span class="loader"></span></LoaderWrapper>
    }

    return (
        <Wrapper>
            <VideoContainer
                id='fullscreen'
            >
                <VideoOverlay
                    onDoubleClick={(e) => {
                        const elm = document.getElementById("fullscreen")

                        !document.fullscreenElement ? elm.requestFullscreen() : document.exitFullscreen()
                    }}
                >
                    <TopBar></TopBar>
                    <MiddleBar>
                        <div className="left">
                            <img src={fowardIcon} alt="" />
                        </div>
                        <div className="center">
                            {state.ended ? (
                                <img
                                    src={replayIcon}
                                    alt="replay"
                                    onClick={togglePlayHandler}
                                />
                            ) :
                                !state.buffering ?
                                    <img
                                        src={!state.playing ? playIcon : pauseIcon}
                                        alt=""
                                        onClick={togglePlayHandler}
                                    />
                                    : <Loader />
                            }
                        </div>
                        <div className="right">
                            <img src={fowardIcon} alt="" />
                        </div>
                    </MiddleBar>
                    <BottomBar playedPercent={state.playedPercent}>
                        <div className="top">
                            <div className="progress-bar">
                                <div className="loaded" ></div>
                                <div className="played" >
                                    <span className="round"></span>
                                </div>
                            </div>
                        </div>
                        <div className="bottom">
                            <div className="left">
                                {/* <span>{state.played.toFixed(2)} / {Math.floor(videoRef?.current?.getDuration()).toFixed(2)}</span> */}
                                <span>00:{secondsToHms(state.played)} - 00:{secondsToHms(videoRef?.current?.getDuration())}</span>
                            </div>
                            <div className="right"></div>
                        </div>
                    </BottomBar>
                </VideoOverlay>
                <ReactPlayer
                    ref={videoRef}
                    wrapper={VideoWrapper}
                    onProgress={(progress) => {
                        setState({ ...state, played: Math.floor(progress.playedSeconds), loaded: Math.floor(progress.loadedSeconds), playedPercent: Math.ceil((Math.floor(progress.playedSeconds) / Math.floor(videoRef?.current.getDuration())) * 100) })
                    }}
                    onBuffer={() => setState({ ...state, buffering: true })}
                    onBufferEnd={() => setState({ ...state, buffering: false })}
                    onEnded={() => setState({ ...state, playing: false, ended: true })}
                    playing={state.playing}
                    muted={state.muted}
                    onSeek={(sec) => {
                        console.log(sec);
                        setState({ ...state, seek: sec })
                    }}
                    url="https://player.vimeo.com/external/726890296.m3u8?s=c47b764dd33f1a05dd84d3374defbe168957d78b"
                // url="https://developers-api.jobified.ai/media/general/orientaion-video/Green_screen_explosion__soundvideo_APcWXqV.mp4"
                />
            </VideoContainer>
            {/* <div style={{ padding: "75% 0 0 0", position: "relative" }}>
                <iframe src="https://player.vimeo.com/video/822668895?h=fda2228e2b&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameOrder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100" %}} title="Android Emulator - Pixel_5_API_33_5554 2022-10-29 11-43-20"></iframe>
            </div>
            <script src="https://player.vimeo.com/api/player.js"></script> */}
        </Wrapper>
    )
}

export default VideoPlayer


const Wrapper = styled.section`
    max-width: 90%;
    width: 1300px;
    margin: 0 auto;
    padding: 42px 0;
`

const VideoContainer = styled.div`
    width: 100%;
    /* max-height: 80vh; */
    background-color: #111;
    position: relative;
`
const VideoOverlay = styled.div`
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* align-items: ; */
    background-color: #0c0c0c77;
    opacity: 0;
    transition: opacity 0.4s ease-in-out;

    :hover{
        opacity: 1;
    }
`
const VideoParent = styled.div`
    width: 100%; 
    /* max-height: 80vh; */
    display: flex;
    justify-content: center;
    align-items: center;

    video{
        height: 100%;
        width: 100%;
    }
`
const TopBar = styled.div`
    height: 10%;
`

const PlayBeat = keyframes`
    25%{
        scale: .6;
    }
    50%{
        scale: 1;
    }
    75%{
        scale: .6;
    }
    100%{
        scale: 1;
    }
`
const MiddleBar = styled.div`
    height: 10%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    img{
        cursor: pointer;
    }

    .left{
        img{
            rotate: 180deg;
            width: 32px;

            :active{
                animation: ${PlayBeat} 1s ease-in-out;
            }
        }
    }
    .center{
        img{
            width: 52px;
            cursor: pointer;

            :active{
                animation: ${PlayBeat} 1s ease-in-out;
            }
        }
    }
    .right{
        img{
            width: 32px;
            :active{
                animation: ${PlayBeat} 1s ease-in-out;
            }
        }
    }
`
const BottomBar = styled.div`
    height: 10%;
    width: 95%;
    margin: 0 auto;
    .top{
        padding: 9px ;
        .progress-bar{
            position: relative;
            margin: 0 auto;
            height: 3px;
            border-radius: 3px;
            background-color: #9c9a9a;
            cursor: pointer;
            /* background-color: ${PRIMARY_COLOR}; */

            .loaded{
                position: absolute;
                top: 0;
                left: 0;
                background-color: #fff;
                /* width: ${props => `${props.playedPercent}%`}; */
                height: 100%;
            }
            .played{
                position: absolute;
                top: 0;
                left: 0;
                background-color: ${PRIMARY_COLOR};
                /* width: 50%; */
                width: ${props => `${props.playedPercent}%`};
                height: 100%;
                /* transition: all 0.2s ease-in-out; */

                span{
                    width: 12px;
                    height: 12px;
                    border-radius:50%;
                    background-color: ${PRIMARY_COLOR};
                    position: inherit;
                    right: -2px;
                    top: -5px;
                }
            }
        }
    }
    .bottom{
        padding: 0 14px;
        .left{
            span{
                font-size: 14px;
                color: #fff;
            }
        }
    }
`

const LoaderWrapper = styled.div`
    .loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  border: 3px solid;
  border-color: #FFF #FFF transparent transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
.loader::after,
.loader::before {
  content: '';  
  box-sizing: border-box;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  border: 3px solid;
  border-color: transparent transparent #FF3D00 #FF3D00;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-sizing: border-box;
  animation: rotationBack 0.5s linear infinite;
  transform-origin: center center;
}
.loader::before {
  width: 32px;
  height: 32px;
  border-color: #FFF #FFF transparent transparent;
  animation: rotation 1.5s linear infinite;
}
    
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
} 
@keyframes rotationBack {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
    
`