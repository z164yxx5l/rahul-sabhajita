///**
// * Created at 9:06:02 PM Jan 21, 2011
// */
//package org.jbox2d.dynamics.joints;
//
//import org.jbox2d.common.Vec2;
//import org.jbox2d.dynamics.TimeStep;
//import org.jbox2d.pooling.WorldPool;
//
///**
// * @author Daniel Murphy
// */
//public class LineJoint extends Joint {
//	
//	public final Vec2 m_localAnchor1;
//	public final Vec2 m_localAnchor2;
//	public final Vec2 m_localXAxis1;
//	public final Vec2 m_localYAxis1;
//
//	public final Vec2 m_axis, m_perp;
//	public float m_s1, m_s2;
//	public float m_a1, m_a2;
//
//	public final Mat22 m_K;
//	public final Vec2 m_impulse;
//
//	public float m_motorMass;			// effective mass for motor/limit translational finalraint.
//	public float m_motorImpulse;
//
//	public float m_lowerTranslation;
//	public float m_upperTranslation;
//	public float m_maxMotorForce;
//	public float m_motorSpeed;
//
//	boolean m_enableLimit;
//	boolean m_enableMotor;
//	LimitState m_limitState;
//	
//	
//	public LineJoint(WorldPool argPool, LineJointDef argDef){
//		super(argPool, argDef);
//		m_localAnchor1 = def.localAnchorA;
//		m_localAnchor2 = def.localAnchorB;
//		m_localXAxis1 = def.localAxisA;
//		m_localYAxis1 = Vec2.cross(1.0f, m_localXAxis1);
//
//		m_impulse.setZero();
//		m_motorMass = 0.0;
//		m_motorImpulse = 0.0f;
//
//		m_lowerTranslation = def.lowerTranslation;
//		m_upperTranslation = def.upperTranslation;
//		m_maxMotorForce = def.maxMotorForce;
//		m_motorSpeed = def.motorSpeed;
//		m_enableLimit = def.enableLimit;
//		m_enableMotor = def.enableMotor;
//		m_limitState = e_inactiveLimit;
//
//		m_axis.setZero();
//		m_perp.setZero();
//	}
//	/**
//	 * @see org.jbox2d.dynamics.joints.Joint#getAnchorA(org.jbox2d.common.Vec2)
//	 */
//	@Override
//	public void getAnchorA(new Vec2 argOut) {
//		return m_bodyA.getWorldPoint(m_localAnchor1);
//
//	}
//	
//	/**
//	 * @see org.jbox2d.dynamics.joints.Joint#getAnchorB(org.jbox2d.common.Vec2)
//	 */
//	@Override
//	public void getAnchorB(new Vec2 argOut) {
//		return m_bodyB.getWorldPoint(m_localAnchor2);
//
//	}
//	
//	/**
//	 * @see org.jbox2d.dynamics.joints.Joint#getReactionForce(float, org.jbox2d.common.Vec2)
//	 */
//	@Override
//	public void getReactionForce(float inv_dt, new Vec2 argOut) {
//		return inv_dt * (m_impulse.x * m_perp + (m_motorImpulse + m_impulse.y) * m_axis);
//
//	}
//	
//	/**
//	 * @see org.jbox2d.dynamics.joints.Joint#getReactionTorque(float)
//	 */
//	@Override
//	public float getReactionTorque(float inv_dt) {
//		return 0.0f;
//
//	}
//	
//	float GetJointTranslation()
//	{
//		Body b1 = m_bodyA;
//		Body  = m_bodyB;
//
//		Vec2 p1 = b1.getWorldPoint(m_localAnchor1);
//		Vec2 p2 = .getWorldPoint(m_localAnchor2);
//		Vec2 d = p2 - p1;
//		Vec2 axis = b1.getWorldVector(m_localXAxis1);
//
//		float translation = Dot(d, axis);
//		return translation;
//	}
//	
//	float GetJointSpeed()
//	{
//		Body b1 = m_bodyA;
//		Body  = m_bodyB;
//
//		Vec2 r1 = Mul(b1.getTransform().R, m_localAnchor1 - b1.getLocalCenter());
//		Vec2 r2 = Mul(.getTransform().R, m_localAnchor2 - .getLocalCenter());
//		Vec2 p1 = b1.m_sweep.c + r1;
//		Vec2 p2 = .m_sweep.c + r2;
//		Vec2 d = p2 - p1;
//		Vec2 axis = b1.getWorldVector(m_localXAxis1);
//
//		Vec2 v1 = b1.m_linearVelocity;
//		Vec2 v2 = .m_linearVelocity;
//		float w1 = b1.m_angularVelocity;
//		float w2 = .m_angularVelocity;
//
//		float speed = Dot(d, Vec2.cross(w1, axis)) + Dot(axis, v2 + Vec2.cross(w2, r2) - v1 - Vec2.cross(w1, r1));
//		return speed;
//	}
//
//	boolean IsLimitEnabled()
//	{
//		return m_enableLimit;
//	}
//
//	void EnableLimit(boolean flag)
//	{
//		m_bodyA.setAwake(true);
//		m_bodyB.setAwake(true);
//		m_enableLimit = flag;
//	}
//
//	float GetLowerLimit()
//	{
//		return m_lowerTranslation;
//	}
//
//	float GetUpperLimit()
//	{
//		return m_upperTranslation;
//	}
//
//	void SetLimits(float lower, float upper)
//	{
//		Assert(lower <= upper);
//		m_bodyA.setAwake(true);
//		m_bodyB.setAwake(true);
//		m_lowerTranslation = lower;
//		m_upperTranslation = upper;
//	}
//
//	boolean IsMotorEnabled()
//	{
//		return m_enableMotor;
//	}
//
//	void EnableMotor(boolean flag)
//	{
//		m_bodyA.setAwake(true);
//		m_bodyB.setAwake(true);
//		m_enableMotor = flag;
//	}
//
//	void SetMotorSpeed(float speed)
//	{
//		m_bodyA.setAwake(true);
//		m_bodyB.setAwake(true);
//		m_motorSpeed = speed;
//	}
//
//	void SetMaxMotorForce(float force)
//	{
//		m_bodyA.setAwake(true);
//		m_bodyB.setAwake(true);
//		m_maxMotorForce = force;
//	}
//
//	float GetMotorForce()
//	{
//		return m_motorImpulse;
//	}
//	
//	/**
//	 * @see org.jbox2d.dynamics.joints.Joint#initVelocityConstraints(org.jbox2d.dynamics.TimeStep)
//	 */
//	@Override
//	public void initVelocityConstraints(TimeStep step) {
//		Body b1 = m_bodyA;
//		Body  = m_bodyB;
//
//		m_localCenterA = b1.getLocalCenter();
//		m_localCenterB = .getLocalCenter();
//
//		Transform xf1 = b1.getTransform();
//		Transform xf2 = .getTransform();
//
//		// Compute the effective masses.
//		Vec2 r1 = Mul(xf1.R, m_localAnchor1 - m_localCenterA);
//		Vec2 r2 = Mul(xf2.R, m_localAnchor2 - m_localCenterB);
//		Vec2 d = .m_sweep.c + r2 - b1.m_sweep.c - r1;
//
//		m_invMassA = b1.m_invMass;
//		m_invIA = b1.m_invI;
//		m_invMassB = .m_invMass;
//		m_invIB = .m_invI;
//
//		// Compute motor Jacobian and effective mass.
//		{
//			m_axis = Mul(xf1.R, m_localXAxis1);
//			m_a1 = Vec2.cross(d + r1, m_axis);
//			m_a2 = Vec2.cross(r2, m_axis);
//
//			m_motorMass = m_invMassA + m_invMassB + m_invIA * m_a1 * m_a1 + m_invIB * m_a2 * m_a2;
//			if (m_motorMass > _epsilon)
//			{
//				m_motorMass = 1.0f / m_motorMass;
//			}
//			else
//			{
//				m_motorMass = 0.0f;
//			}
//		}
//
//		// Prismatic finalraint.
//		{
//			m_perp = Mul(xf1.R, m_localYAxis1);
//
//			m_s1 = Vec2.cross(d + r1, m_perp);
//			m_s2 = Vec2.cross(r2, m_perp);
//
//			float m1 = m_invMassA, m2 = m_invMassB;
//			float i1 = m_invIA, i2 = m_invIB;
//
//			float k11 = m1 + m2 + i1 * m_s1 * m_s1 + i2 * m_s2 * m_s2;
//			float k12 = i1 * m_s1 * m_a1 + i2 * m_s2 * m_a2;
//			float k22 = m1 + m2 + i1 * m_a1 * m_a1 + i2 * m_a2 * m_a2;
//
//			m_K.col1.set(k11, k12);
//			m_K.col2.set(k12, k22);
//		}
//
//		// Compute motor and limit terms.
//		if (m_enableLimit)
//		{
//			float jointTranslation = Dot(m_axis, d);
//			if (MathUtils.abs(m_upperTranslation - m_lowerTranslation) < 2.0f * Settings.linearSlop)
//			{
//				m_limitState = e_equalLimits;
//			}
//			else if (jointTranslation <= m_lowerTranslation)
//			{
//				if (m_limitState != e_atLowerLimit)
//				{
//					m_limitState = e_atLowerLimit;
//					m_impulse.y = 0.0f;
//				}
//			}
//			else if (jointTranslation >= m_upperTranslation)
//			{
//				if (m_limitState != e_atUpperLimit)
//				{
//					m_limitState = e_atUpperLimit;
//					m_impulse.y = 0.0f;
//				}
//			}
//			else
//			{
//				m_limitState = e_inactiveLimit;
//				m_impulse.y = 0.0f;
//			}
//		}
//		else
//		{
//			m_limitState = e_inactiveLimit;
//		}
//
//		if (m_enableMotor == false)
//		{
//			m_motorImpulse = 0.0f;
//		}
//
//		if (step.warmStarting)
//		{
//			// Account for variable time step.
//			m_impulse *= step.dtRatio;
//			m_motorImpulse *= step.dtRatio;
//
//			Vec2 P = m_impulse.x * m_perp + (m_motorImpulse + m_impulse.y) * m_axis;
//			float L1 = m_impulse.x * m_s1 + (m_motorImpulse + m_impulse.y) * m_a1;
//			float L2 = m_impulse.x * m_s2 + (m_motorImpulse + m_impulse.y) * m_a2;
//
//			b1.m_linearVelocity -= m_invMassA * P;
//			b1.m_angularVelocity -= m_invIA * L1;
//
//			.m_linearVelocity += m_invMassB * P;
//			.m_angularVelocity += m_invIB * L2;
//		}
//		else
//		{
//			m_impulse.setZero();
//			m_motorImpulse = 0.0f;
//		}
//	}
//	
//	/**
//	 * @see org.jbox2d.dynamics.joints.Joint#solveVelocityConstraints(org.jbox2d.dynamics.TimeStep)
//	 */
//	@Override
//	public void solveVelocityConstraints(TimeStep step) {
//		Body b1 = m_bodyA;
//		Body  = m_bodyB;
//
//		Vec2 v1 = b1.m_linearVelocity;
//		float w1 = b1.m_angularVelocity;
//		Vec2 v2 = .m_linearVelocity;
//		float w2 = .m_angularVelocity;
//
//		// Solve linear motor finalraint.
//		if (m_enableMotor && m_limitState != e_equalLimits)
//		{
//			float Cdot = Dot(m_axis, v2 - v1) + m_a2 * w2 - m_a1 * w1;
//			float impulse = m_motorMass * (m_motorSpeed - Cdot);
//			float oldImpulse = m_motorImpulse;
//			float maxImpulse = step.dt * m_maxMotorForce;
//			m_motorImpulse = Clamp(m_motorImpulse + impulse, -maxImpulse, maxImpulse);
//			impulse = m_motorImpulse - oldImpulse;
//
//			Vec2 P = impulse * m_axis;
//			float L1 = impulse * m_a1;
//			float L2 = impulse * m_a2;
//
//			v1 -= m_invMassA * P;
//			w1 -= m_invIA * L1;
//
//			v2 += m_invMassB * P;
//			w2 += m_invIB * L2;
//		}
//
//		float Cdot1 = Dot(m_perp, v2 - v1) + m_s2 * w2 - m_s1 * w1;
//
//		if (m_enableLimit && m_limitState != e_inactiveLimit)
//		{
//			// Solve prismatic and limit finalraint in block form.
//			float Cdot2 = Dot(m_axis, v2 - v1) + m_a2 * w2 - m_a1 * w1;
//			Vec2 Cdot(Cdot1, Cdot2);
//
//			Vec2 f1 = m_impulse;
//			Vec2 df =  m_K.Solve(-Cdot);
//			m_impulse += df;
//
//			if (m_limitState == e_atLowerLimit)
//			{
//				m_impulse.y = Max(m_impulse.y, 0.0f);
//			}
//			else if (m_limitState == e_atUpperLimit)
//			{
//				m_impulse.y = Min(m_impulse.y, 0.0f);
//			}
//
//			// f2(1) = invK(1,1) * (-Cdot(1) - K(1,2) * (f2(2) - f1(2))) + f1(1)
//			float b = -Cdot1 - (m_impulse.y - f1.y) * m_K.col2.x;
//			float f2r;
//			if (m_K.col1.x != 0.0f)
//			{
//				f2r = b / m_K.col1.x + f1.x;
//			}
//			else
//			{
//				f2r = f1.x;	
//			}
//
//			m_impulse.x = f2r;
//
//			df = m_impulse - f1;
//
//			Vec2 P = df.x * m_perp + df.y * m_axis;
//			float L1 = df.x * m_s1 + df.y * m_a1;
//			float L2 = df.x * m_s2 + df.y * m_a2;
//
//			v1 -= m_invMassA * P;
//			w1 -= m_invIA * L1;
//
//			v2 += m_invMassB * P;
//			w2 += m_invIB * L2;
//		}
//		else
//		{
//			// Limit is inactive, just solve the prismatic finalraint in block form.
//			float df;
//			if (m_K.col1.x != 0.0f)
//			{
//				df = - Cdot1 / m_K.col1.x;
//			}
//			else
//			{
//				df = 0.0f;
//			}
//			m_impulse.x += df;
//
//			Vec2 P = df * m_perp;
//			float L1 = df * m_s1;
//			float L2 = df * m_s2;
//
//			v1 -= m_invMassA * P;
//			w1 -= m_invIA * L1;
//
//			v2 += m_invMassB * P;
//			w2 += m_invIB * L2;
//		}
//
//		b1.m_linearVelocity = v1;
//		b1.m_angularVelocity = w1;
//		.m_linearVelocity = v2;
//		.m_angularVelocity = w2;
//	}
//	
//	/**
//	 * @see org.jbox2d.dynamics.joints.Joint#solvePositionConstraints(float)
//	 */
//	@Override
//	public boolean solvePositionConstraints(float baumgarte) {
//		Body b1 = m_bodyA;
//		Body  = m_bodyB;
//
//		Vec2 c1 = b1.m_sweep.c;
//		float a1 = b1.m_sweep.a;
//
//		Vec2 c2 = .m_sweep.c;
//		float a2 = .m_sweep.a;
//
//		// Solve linear limit finalraint.
//		float linearError = 0.0f, angularError = 0.0f;
//		boolean active = false;
//		float C2 = 0.0f;
//
//		Mat22 R1(a1), R2(a2);
//
//		Vec2 r1 = Mul(R1, m_localAnchor1 - m_localCenterA);
//		Vec2 r2 = Mul(R2, m_localAnchor2 - m_localCenterB);
//		Vec2 d = c2 + r2 - c1 - r1;
//
//		if (m_enableLimit)
//		{
//			m_axis = Mul(R1, m_localXAxis1);
//
//			m_a1 = Vec2.cross(d + r1, m_axis);
//			m_a2 = Vec2.cross(r2, m_axis);
//
//			float translation = Dot(m_axis, d);
//			if (MathUtils.abs(m_upperTranslation - m_lowerTranslation) < 2.0f * Settings.linearSlop)
//			{
//				// Prevent large angular corrections
//				C2 = Clamp(translation, -_maxLinearCorrection, _maxLinearCorrection);
//				linearError = MathUtils.abs(translation);
//				active = true;
//			}
//			else if (translation <= m_lowerTranslation)
//			{
//				// Prevent large linear corrections and allow some slop.
//				C2 = Clamp(translation - m_lowerTranslation + Settings.linearSlop, -_maxLinearCorrection, 0.0f);
//				linearError = m_lowerTranslation - translation;
//				active = true;
//			}
//			else if (translation >= m_upperTranslation)
//			{
//				// Prevent large linear corrections and allow some slop.
//				C2 = Clamp(translation - m_upperTranslation - Settings.linearSlop, 0.0f, _maxLinearCorrection);
//				linearError = translation - m_upperTranslation;
//				active = true;
//			}
//		}
//
//		m_perp = Mul(R1, m_localYAxis1);
//
//		m_s1 = Vec2.cross(d + r1, m_perp);
//		m_s2 = Vec2.cross(r2, m_perp);
//
//		Vec2 impulse;
//		float C1;
//		C1 = Dot(m_perp, d);
//
//		linearError = Max(linearError, MathUtils.abs(C1));
//		angularError = 0.0f;
//
//		if (active)
//		{
//			float m1 = m_invMassA, m2 = m_invMassB;
//			float i1 = m_invIA, i2 = m_invIB;
//
//			float k11 = m1 + m2 + i1 * m_s1 * m_s1 + i2 * m_s2 * m_s2;
//			float k12 = i1 * m_s1 * m_a1 + i2 * m_s2 * m_a2;
//			float k22 = m1 + m2 + i1 * m_a1 * m_a1 + i2 * m_a2 * m_a2;
//
//			m_K.col1.set(k11, k12);
//			m_K.col2.set(k12, k22);
//
//			Vec2 C;
//			C.x = C1;
//			C.y = C2;
//
//			impulse = m_K.Solve(-C);
//		}
//		else
//		{
//			float m1 = m_invMassA, m2 = m_invMassB;
//			float i1 = m_invIA, i2 = m_invIB;
//
//			float k11 = m1 + m2 + i1 * m_s1 * m_s1 + i2 * m_s2 * m_s2;
//
//			float impulse1;
//			if (k11 != 0.0f)
//			{
//				impulse1 = - C1 / k11;
//			}
//			else
//			{
//				impulse1 = 0.0f;
//			}
//
//			impulse.x = impulse1;
//			impulse.y = 0.0f;
//		}
//
//		Vec2 P = impulse.x * m_perp + impulse.y * m_axis;
//		float L1 = impulse.x * m_s1 + impulse.y * m_a1;
//		float L2 = impulse.x * m_s2 + impulse.y * m_a2;
//
//		c1 -= m_invMassA * P;
//		a1 -= m_invIA * L1;
//		c2 += m_invMassB * P;
//		a2 += m_invIB * L2;
//
//		// TODO_ERIN remove need for this.
//		b1.m_sweep.c = c1;
//		b1.m_sweep.a = a1;
//		.m_sweep.c = c2;
//		.m_sweep.a = a2;
//		b1.SynchronizeTransform();
//		.SynchronizeTransform();
//
//		return linearError <= Settings.linearSlop && angularError <= _angularSlop;
//	}
//	
//}