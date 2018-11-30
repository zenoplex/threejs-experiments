import * as THREE from 'three';

class Main {
  public step: number = 0.0;
  public stepIncrement: number = 0.001;

  public rotation: number = 0.0;
  public rotationIncrement: number = 0.01;

  public renderer: THREE.WebGLRenderer;

  public scene: THREE.Scene;

  public camera: THREE.PerspectiveCamera;

  private spline: THREE.CatmullRomCurve3 | null = null;

  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.append(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();

    const geom = this.generateTunnel(20, 256, 3, 50);
    const tunnel = this.createParicle(geom);

    this.scene.add(tunnel);
    this.resize();
    this.render();

    window.removeEventListener('resize', this.resize);
    window.addEventListener('resize', this.resize);
  }

  private generateTunnel = (
    count: number,
    segments: number,
    radius: number,
    radiusSegments: number
  ) => {
    const points = [new THREE.Vector3()];
    const offset = 10;
    for (let i = 1; i < count; i++) {
      const prevPoint = points[i - 1];
      const x = prevPoint.x + offset + Math.round(Math.random() * offset * 2);
      const y = prevPoint.y + offset + Math.round(Math.random() * offset * 2);
      const z = prevPoint.z + offset + Math.round(Math.random() * offset * 2);
      const point = new THREE.Vector3(x, y, z);
      points.push(point);
    }

    this.spline = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(
      this.spline,
      segments,
      radius,
      radiusSegments
    );
  };

  private createParicle = (geom: THREE.Geometry) => {
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });
    const points = new THREE.Points(geom, material);

    return points;
  };

  private render = () => {
    if (this.step > 1 - this.stepIncrement) {
      this.step = 0.0;
    }

    if (!this.spline) {
      return;
    }
    const point1 = this.spline.getPointAt(this.step);
    const point2 = this.spline.getPointAt(this.step + this.stepIncrement);

    this.camera.position.set(point1.x, point1.y, point1.z);
    this.camera.lookAt(point2);
    this.camera.rotateZ(this.rotation);

    this.step += this.stepIncrement;
    this.rotation += this.rotationIncrement;

    requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);
  };

  private resize = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  };
}

// tslint:disable-next-line no-unused-expression
new Main();
