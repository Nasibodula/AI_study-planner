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