import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Users, Hospital, ClipboardList, DollarSign, Heart, Wrench, ArrowRight, CheckCircle } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Hospital className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">MediFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#workflow" className="text-sm font-medium hover:text-primary">
              Workflow
            </Link>
            <Link href="#benefits" className="text-sm font-medium hover:text-primary">
              Benefits
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="#contact"
              className="hidden md:inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Contact Sales
            </Link>
            <Button>Request Demo</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-accent/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Hospital Management System
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A comprehensive solution for streamlining healthcare operations, enhancing patient care, and
                    optimizing administrative workflows.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="gap-1">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    View Demo
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  width={600}
                  height={400}
                  alt="Hospital Management System Dashboard"
                  className="rounded-lg object-cover border shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Comprehensive Solution
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Integrated Modules for Complete Hospital Management
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our system offers a complete suite of tools designed to streamline every aspect of hospital
                  operations.
                </p>
              </div>
            </div>
            <div className="mx-auto grid gap-8 md:gap-12 mt-12 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Users className="h-10 w-10 text-primary" />}
                title="Patient Management"
                description="Streamline registration, triage, queue management, and appointment scheduling for efficient patient flow."
                color="bg-[#a8dadc]/10"
              />
              <FeatureCard
                icon={<Hospital className="h-10 w-10 text-primary" />}
                title="Clinical Operations"
                description="Manage OPD consultations, diagnoses, prescriptions, lab orders, and inpatient services seamlessly."
                color="bg-[#8ecae6]/10"
              />
              <FeatureCard
                icon={<ClipboardList className="h-10 w-10 text-primary" />}
                title="Electronic Health Records"
                description="Maintain comprehensive digital patient histories, documentation, test results, and treatment progress."
                color="bg-[#bee3db]/10"
              />
              <FeatureCard
                icon={<DollarSign className="h-10 w-10 text-primary" />}
                title="Financial Management"
                description="Handle cost estimation, insurance verification, payment processing, invoicing, and claims management."
                color="bg-[#e9c46a]/10"
              />
              <FeatureCard
                icon={<Heart className="h-10 w-10 text-primary" />}
                title="Senior Care"
                description="Provide specialized geriatric assessment, care planning, monitoring, medication management, and family communication."
                color="bg-[#ffd6a5]/10"
              />
              <FeatureCard
                icon={<Wrench className="h-10 w-10 text-primary" />}
                title="Support Services"
                description="Coordinate lab management, radiology services, dietary services, and housekeeping operations."
                color="bg-[#2a9d8f]/10"
              />
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="workflow" className="w-full py-12 md:py-24 bg-accent/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Seamless Process
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Hospital Management Workflow
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our system implements a comprehensive workflow that connects all aspects of hospital operations.
                </p>
              </div>
            </div>
            <div className="mt-12 overflow-hidden rounded-lg border bg-background p-4 md:p-8 shadow-lg">
              <Image
                src="/placeholder.svg?height=600&width=1200"
                width={1200}
                height={600}
                alt="Hospital Management Workflow Diagram"
                className="w-full"
              />
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Comprehensive workflow diagram showing the interconnected processes of the hospital management system
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="w-full py-12 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Why Choose Us
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Benefits of Our Hospital Management System
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover how our system can transform your healthcare facility's operations.
                </p>
              </div>
            </div>
            <div className="mx-auto grid gap-8 md:gap-12 mt-12 sm:grid-cols-2 lg:grid-cols-3">
              <BenefitCard
                title="Improved Patient Experience"
                description="Streamlined registration, reduced wait times, and better coordination of care enhance the overall patient experience."
              />
              <BenefitCard
                title="Enhanced Clinical Efficiency"
                description="Digital documentation, integrated test results, and streamlined workflows allow healthcare providers to focus more on patient care."
              />
              <BenefitCard
                title="Optimized Resource Utilization"
                description="Better scheduling and resource allocation lead to improved utilization of staff, equipment, and facilities."
              />
              <BenefitCard
                title="Reduced Administrative Burden"
                description="Automation of routine tasks and paperless operations reduce administrative overhead and minimize errors."
              />
              <BenefitCard
                title="Improved Financial Performance"
                description="Streamlined billing, insurance verification, and claims management lead to faster reimbursements and reduced revenue leakage."
              />
              <BenefitCard
                title="Data-Driven Decision Making"
                description="Comprehensive reporting and analytics provide insights for continuous improvement and strategic planning."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="w-full py-12 md:py-24 bg-primary/10">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Ready to Transform Your Hospital Operations?
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Contact our team today to schedule a personalized demo and discover how our Hospital Management
                    System can benefit your healthcare facility.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="gap-1">
                    Request Demo <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Contact Sales
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  width={600}
                  height={400}
                  alt="Healthcare professionals using the system"
                  className="rounded-lg object-cover border shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted">
        <div className="container flex flex-col gap-6 py-8 md:py-12">
          <div className="flex flex-col gap-6 md:flex-row md:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Hospital className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">MediFlow</span>
              </div>
              <p className="max-w-[350px] text-sm text-muted-foreground">
                Comprehensive Hospital Management System for streamlining healthcare operations and enhancing patient
                care.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      Demo
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} MediFlow. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, color }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className={`mb-4 rounded-full p-4 ${color || "bg-primary/20"}`}>{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  )
}

function BenefitCard({ title, description }) {
  return (
    <div className="flex flex-col items-start rounded-lg border bg-background p-6 shadow-sm">
      <div className="mb-4">
        <CheckCircle className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  )
}
