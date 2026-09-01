/**
 * 付费课程媒体映射。
 *
 * 638MB 视频不能进入小程序包或 GitHub。请将母版上传至微信云开发存储的
 * course-videos/ 目录，再把控制台返回的 cloud:// fileID 填到 cloudFileId。
 * course-player 会在用户购买后换取临时播放地址，不向未购买用户暴露 URL。
 */
export interface CourseMedia {
  key: string
  title: string
  sourceFile: string
  duration: string
  cloudFileId: string
}

export const courseMedia: CourseMedia[] = [
  { key: 'f1', title: '你一定可以走出来', sourceFile: '【第一期】你一定可以走出来.mov', duration: '6:07', cloudFileId: 'cloud://cloud1-d7g7pej7e15c22608.636c-cloud1-d7g7pej7e15c22608-1474700235/【第一期】你一定可以走出来.mov' },
  { key: 'f2', title: '强迫症的本质是什么', sourceFile: '【第二期】强迫症的本质是什么.mov', duration: '7:18', cloudFileId: 'cloud://cloud1-d7g7pej7e15c22608.636c-cloud1-d7g7pej7e15c22608-1474700235/【第二期】强迫症的本质是什么.mov' },
  { key: 'f3', title: '强迫症的根源疗愈之道', sourceFile: '【第三期】强迫症的根源疗愈之道.mov', duration: '8:03', cloudFileId: 'cloud://cloud1-d7g7pej7e15c22608.636c-cloud1-d7g7pej7e15c22608-1474700235/【第三期】强迫症的根源疗愈之道.mov' },
  { key: 'f4', title: '何为安那般那念', sourceFile: '【第四期】何为安娜般娜念.mov', duration: '5:54', cloudFileId: 'cloud://cloud1-d7g7pej7e15c22608.636c-cloud1-d7g7pej7e15c22608-1474700235/【第四期】何为安娜般娜念.mov' },
  { key: 'f5', title: '平等心的重要性', sourceFile: '【第五期】平等心的重要性.mov', duration: '3:00', cloudFileId: 'cloud://cloud1-d7g7pej7e15c22608.636c-cloud1-d7g7pej7e15c22608-1474700235/【第五期】平等心的重要性.mov' },
  { key: 'f6', title: '带你做内观（第一周）', sourceFile: '【第六期】带你做内观（20min第一周）.mov', duration: '23:50', cloudFileId: 'cloud://cloud1-d7g7pej7e15c22608.636c-cloud1-d7g7pej7e15c22608-1474700235/【第六期】带你做内观（20min第一周）.mov' },
  { key: 'f7', title: '就是如此', sourceFile: '【第七期】就是如此.mov', duration: '9:49', cloudFileId: 'cloud://cloud1-d7g7pej7e15c22608.636c-cloud1-d7g7pej7e15c22608-1474700235/【第七期】就是如此.mov' },
  { key: 'f8', title: '就是如此生活深化练习', sourceFile: '【第八期】就是如此生活深化练习.mov', duration: '10:15', cloudFileId: 'cloud://cloud1-d7g7pej7e15c22608.636c-cloud1-d7g7pej7e15c22608-1474700235/【第八期】就是如此生活深化练习.mov' },
  { key: 'f9', title: '真正好的状态是什么样子的', sourceFile: '【第九期】真正好的状态是什么样子的.mp4', duration: '6:17', cloudFileId: 'cloud://cloud1-d7g7pej7e15c22608.636c-cloud1-d7g7pej7e15c22608-1474700235/【第九期】真正好的状态是什么样子的.mp4' },
  { key: 'f10', title: '自然法则（随时听）', sourceFile: '自然法则【随时听】.mov', duration: '3:35', cloudFileId: 'cloud://cloud1-d7g7pej7e15c22608.636c-cloud1-d7g7pej7e15c22608-1474700235/自然法则【随时听】.mov' },
  { key: 'f11', title: '30 分钟内观音频（第二周）', sourceFile: '30min内观音频【第二周】.mp4', duration: '30:01', cloudFileId: 'cloud://cloud1-d7g7pej7e15c22608.636c-cloud1-d7g7pej7e15c22608-1474700235/30min内观音频【第二周】.mp4' },
  { key: 'f12', title: '陈川导师实战技巧指导（上）', sourceFile: '陈川导师四月走出强迫内观实战技巧指导（上）.mov', duration: '20:15', cloudFileId: 'cloud://cloud1-d7g7pej7e15c22608.636c-cloud1-d7g7pej7e15c22608-1474700235/陈川导师四月走出强迫内观实战技巧指导（上）.mov' },
  { key: 'f13', title: '陈川导师实战技巧指导（中）', sourceFile: '陈川导师四月走出强迫内观实战技巧指导（中）.mov', duration: '30:11', cloudFileId: 'cloud://cloud1-d7g7pej7e15c22608.636c-cloud1-d7g7pej7e15c22608-1474700235/陈川导师四月走出强迫内观实战技巧指导（中）.mov' },
  { key: 'f14', title: '陈川导师实战技巧指导（下）', sourceFile: '陈川导师四月走出强迫内观实战技巧指导（下）.mov', duration: '29:48', cloudFileId: 'cloud://cloud1-d7g7pej7e15c22608.636c-cloud1-d7g7pej7e15c22608-1474700235/陈川导师四月走出强迫内观实战技巧指导（下）.mov' }
]

export function getCourseMedia(key: string): CourseMedia | undefined {
  return courseMedia.find(item => item.key === key)
}
