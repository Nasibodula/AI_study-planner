// import * as faceapi from 'face-api.js';

// class FocusTrackingService {
//   constructor() {
//     this.isModelLoaded = false;
//   }

//   async loadModels() {
//     try {
//       await Promise.all([
//         faceapi.nets.tinyFaceDetector.load('/models'),
//         faceapi.nets.faceLandmark68Net.load('/models'),
//         faceapi.nets.faceExpressionNet.load('/models')
//       ]);
//       this.isModelLoaded = true;
//       return true;
//     } catch (err) {
//       console.error('Error loading models:', err);
//       throw new Error('Failed to load face detection models');
//     }
//   }

//   async detectFace(videoElement) {
//     if (!this.isModelLoaded) {
//       throw new Error('Face detection models not loaded');
//     }

//     const options = new faceapi.TinyFaceDetectorOptions({
//       inputSize: 224,
//       scoreThreshold: 0.5
//     });

//     try {
//       const detections = await faceapi
//         .detectAllFaces(videoElement, options)
//         .withFaceLandmarks()
//         .withFaceExpressions();

//       return detections;
//     } catch (err) {
//       console.error('Detection error:', err);
//       throw new Error('Face detection failed');
//     }
//   }

//   calculateFocusScore(detection, videoWidth, videoHeight) {
//     if (!detection) return { score: 0, isLookingAway: true };

//     const face = detection[0];
//     if (!face) return { score: 0, isLookingAway: true };

//     // Calculate center position
//     const centerX = videoWidth / 2;
//     const centerY = videoHeight / 2;
//     const faceX = face.detection.box.x + (face.detection.box.width / 2);
//     const faceY = face.detection.box.y + (face.detection.box.height / 2);

//     // Calculate normalized distance from center
//     const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
//     const distance = Math.sqrt(Math.pow(faceX - centerX, 2) + Math.pow(faceY - centerY, 2));
//     const normalizedDistance = (maxDistance - distance) / maxDistance;

//     // Calculate scores
//     const expressionScore = face.expressions.neutral || 0;
//     const positionScore = normalizedDistance;
//     const rawScore = (expressionScore + positionScore) * 50;

//     return {
//       score: Math.max(0, Math.min(100, rawScore)),
//       isLookingAway: normalizedDistance < 0.5
//     };
//   }
// }

// export default new FocusTrackingService();




// import * as faceapi from 'face-api.js';

// class FocusTrackingService {
//   constructor() {
//     this.isModelLoaded = false;
//   }

//   // async loadModels() {
//   //   try {
//   //     const MODEL_URL = '/models';
      
//   //     await Promise.all([
//   //       faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//   //       faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//   //       faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
//   //     ]);
      
//   //     this.isModelLoaded = true;
//   //   } catch (error) {
//   //     console.error('Error loading face detection models:', error);
//   //     throw new Error('Failed to load face detection models');
//   //   }
//   // }

//   async loadModels() {
//     try {
//       const MODEL_URL = `${process.env.PUBLIC_URL}/models`;
      
//       // First verify if models directory is accessible
//       const testResponse = await fetch(`${MODEL_URL}/models.json`);
//       if (!testResponse.ok) {
//         throw new Error(`Models directory not accessible: ${testResponse.statusText}`);
//       }
  
//       const modelLoaders = [
//         {
//           net: faceapi.nets.tinyFaceDetector,
//           name: 'TinyFaceDetector'
//         },
//         {
//           net: faceapi.nets.faceLandmark68Net,
//           name: 'FaceLandmark68Net'
//         },
//         {
//           net: faceapi.nets.faceExpressionNet,
//           name: 'FaceExpressionNet'
//         }
//       ];
  
//       for (const loader of modelLoaders) {
//         console.log(`Loading ${loader.name}...`);
//         await loader.net.loadFromUri(MODEL_URL);
//         console.log(`${loader.name} loaded successfully`);
//       }
  
//       this.isModelLoaded = true;
//       console.log('All models loaded successfully');
//     } catch (error) {
//       console.error('Error loading face detection models:', error);
//       throw error;
//     }
//   }
  
  



//   async detectFace(video) {
//     if (!this.isModelLoaded) {
//       throw new Error('Face detection models not loaded');
//     }

//     const detection = await faceapi.detectSingleFace(
//       video,
//       new faceapi.TinyFaceDetectorOptions()
//     ).withFaceLandmarks().withFaceExpressions();

//     return detection;
//   }

//   calculateFocusScore(detection, videoWidth, videoHeight) {
//     if (!detection) return 0;

//     // Get face position relative to center
//     const face = detection.detection.box;
//     const centerX = videoWidth / 2;
//     const centerY = videoHeight / 2;
    
//     // Calculate distance from center
//     const distanceFromCenter = Math.sqrt(
//       Math.pow((face.x + face.width/2) - centerX, 2) +
//       Math.pow((face.y + face.height/2) - centerY, 2)
//     );
    
//     // Get dominant expression
//     const expressions = detection.expressions;
//     const attentiveExpressions = expressions.neutral + expressions.happy;
    
//     // Calculate score based on position and expression
//     const positionScore = Math.max(0, 100 - (distanceFromCenter / 5));
//     const expressionScore = attentiveExpressions * 100;
    
//     return Math.round((positionScore * 0.6) + (expressionScore * 0.4));
//   }
// }

// export default new FocusTrackingService();




import * as faceapi from 'face-api.js';

class FocusTrackingService {
  static isModelLoaded = false;
  static MODEL_PATHS = {
    tinyFaceDetector: '/models/tiny_face_detector_model-weights_manifest.json',
    faceLandmark68Net: '/models/face_landmark_68_model-weights_manifest.json',
    faceExpressionNet: '/models/face_expression_model-weights_manifest.json'
  };

  static async loadModels() {
    try {
      if (this.isModelLoaded) {
        console.log('Models already loaded');
        return;
      }

      console.log('Loading face detection models...');
      
      // Verify model files exist before loading
      const modelChecks = await Promise.all(
        Object.values(this.MODEL_PATHS).map(async path => {
          const response = await fetch(path);
          return response.ok;
        })
      );

      if (!modelChecks.every(check => check)) {
        throw new Error('Some model files are missing');
      }

      // Load models with proper paths
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ]);

      this.isModelLoaded = true;
      console.log('Face detection models loaded successfully');
    } catch (error) {
      console.error('Error loading face detection models:', error);
      this.isModelLoaded = false;
      throw new Error(`Failed to load face detection models: ${error.message}`);
    }
  }

  static async verifyModels() {
    if (!this.isModelLoaded) {
      await this.loadModels();
    }
    return this.isModelLoaded;
  }

  static async detectFace(video) {
    if (!video) {
      throw new Error('Video element is required');
    }

    await this.verifyModels();

    return await faceapi.detectSingleFace(
      video,
      new faceapi.TinyFaceDetectorOptions({
        inputSize: 512,
        scoreThreshold: 0.5
      })
    ).withFaceLandmarks().withFaceExpressions();
  }

  static calculateFocusScore(detection, videoWidth, videoHeight) {
    if (!detection) return 0;

    const face = detection.detection.box;
    const centerX = videoWidth / 2;
    const centerY = videoHeight / 2;

    // Calculate distance from center
    const distanceFromCenter = Math.sqrt(
      Math.pow((face.x + face.width/2) - centerX, 2) +
      Math.pow((face.y + face.height/2) - centerY, 2)
    );

    // Calculate expression-based attention
    const expressions = detection.expressions;
    const attentiveExpressions = expressions.neutral + expressions.happy;

    // Calculate scores
    const positionScore = Math.max(0, 100 - (distanceFromCenter / 5));
    const expressionScore = attentiveExpressions * 100;

    // Weighted average
    return Math.round((positionScore * 0.6) + (expressionScore * 0.4));
  }
}

export default FocusTrackingService;