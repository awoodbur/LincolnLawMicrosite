'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, HelpCircle, ArrowLeft } from 'lucide-react';
import { generateFAQSchema } from '@/lib/metadata';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'chapter7' | 'chapter13' | 'utah' | 'process';
}

const faqs: FAQItem[] = [
  // General Bankruptcy Questions
  {
    category: 'general',
    question: 'What is bankruptcy?',
    answer: 'Bankruptcy is a legal process that helps individuals or businesses eliminate or repay their debts under the protection of federal bankruptcy court. It provides a fresh financial start by either discharging eligible debts (Chapter 7) or creating a manageable repayment plan (Chapter 13).',
  },
  {
    category: 'general',
    question: 'Will bankruptcy ruin my credit forever?',
    answer: 'No. While bankruptcy does impact your credit score initially, many people see their scores improve within 1-2 years after filing. Chapter 7 stays on your credit report for 10 years, and Chapter 13 for 7 years, but the impact lessens over time. Many clients are able to qualify for credit cards, car loans, and even mortgages within a few years of filing.',
  },
  {
    category: 'general',
    question: 'What debts can be discharged in bankruptcy?',
    answer: 'Most unsecured debts can be discharged, including credit card debt, medical bills, personal loans, utility bills, and past-due rent. However, certain debts typically cannot be discharged, such as recent taxes, student loans (in most cases), child support, alimony, and debts incurred through fraud.',
  },
  {
    category: 'general',
    question: 'Will I lose everything I own?',
    answer: 'No. Most people who file bankruptcy keep all or most of their property. Utah has generous exemption laws that protect equity in your home, vehicle, retirement accounts, household goods, and personal items. An experienced bankruptcy attorney can help you understand what property is protected in your specific situation.',
  },
  {
    category: 'general',
    question: 'Can I keep my house and car?',
    answer: 'In most cases, yes. If you\'re current on your mortgage and car payments and the equity is within Utah\'s exemption limits, you can typically keep these assets. Chapter 13 bankruptcy can even help you catch up on missed payments and prevent foreclosure or repossession.',
  },

  // Chapter 7 Specific
  {
    category: 'chapter7',
    question: 'What is Chapter 7 bankruptcy?',
    answer: 'Chapter 7, often called "liquidation bankruptcy," eliminates most unsecured debts within 3-4 months. It\'s designed for individuals who don\'t have enough disposable income to repay their debts. Most Chapter 7 cases are "no-asset" cases, meaning you keep all your property because it\'s protected by exemptions.',
  },
  {
    category: 'chapter7',
    question: 'Do I qualify for Chapter 7?',
    answer: 'To qualify for Chapter 7, you must pass the "means test," which compares your income to Utah\'s median income for your household size. If your income is below the median, you automatically qualify. If it\'s above, you may still qualify if your disposable income (after allowed expenses) is low enough.',
  },
  {
    category: 'chapter7',
    question: 'How long does Chapter 7 take?',
    answer: 'The entire Chapter 7 process typically takes 3-4 months from filing to discharge. You\'ll attend one meeting with the bankruptcy trustee (called the 341 meeting) about 30-40 days after filing, and if there are no complications, you\'ll receive your discharge 60-90 days after that meeting.',
  },
  {
    category: 'chapter7',
    question: 'What is the means test?',
    answer: 'The means test is a calculation that determines if your income is low enough to qualify for Chapter 7. It compares your average monthly income over the past six months to Utah\'s median income for your household size. The test also considers your necessary living expenses to calculate disposable income.',
  },

  // Chapter 13 Specific
  {
    category: 'chapter13',
    question: 'What is Chapter 13 bankruptcy?',
    answer: 'Chapter 13, sometimes called "wage earner\'s plan," allows you to keep your property while repaying debts through a 3-5 year court-approved repayment plan. It\'s ideal if you have regular income, want to catch up on mortgage or car payments, or have non-exempt assets you want to protect.',
  },
  {
    category: 'chapter13',
    question: 'How much do I have to repay in Chapter 13?',
    answer: 'The amount depends on your income, expenses, assets, and types of debt. You must pay secured debts (like mortgage arrears or car loans) in full, but unsecured debts (like credit cards) may be paid partially or not at all. Many Chapter 13 plans pay unsecured creditors only a small percentage of what\'s owed.',
  },
  {
    category: 'chapter13',
    question: 'Can Chapter 13 stop foreclosure?',
    answer: 'Yes. Filing Chapter 13 immediately stops foreclosure through the "automatic stay." You can then catch up on missed mortgage payments through your repayment plan while keeping your home. This is one of the most powerful benefits of Chapter 13 for homeowners facing foreclosure.',
  },
  {
    category: 'chapter13',
    question: 'What happens after I complete my Chapter 13 plan?',
    answer: 'After successfully completing your 3-5 year repayment plan, you\'ll receive a discharge of remaining eligible unsecured debts. Any debts paid through the plan are resolved, and you\'ll have successfully protected your assets while addressing your financial obligations.',
  },

  // Utah-Specific Questions
  {
    category: 'utah',
    question: 'What property exemptions does Utah allow?',
    answer: 'Utah allows generous exemptions including: up to $47,000 equity in your primary residence (homestead exemption), up to $3,000 in vehicle equity, unlimited retirement accounts, $500 per item for household goods and furnishings, tools of trade up to $3,500, and more. These amounts are adjusted periodically for inflation.',
  },
  {
    category: 'utah',
    question: 'What is Utah\'s median income for the means test?',
    answer: 'Utah\'s median income varies by household size and is updated periodically. As of 2024, approximate figures are: 1 person - $58,000; 2 people - $72,000; 3 people - $82,000; 4 people - $95,000. Your attorney will use the most current figures when evaluating your case.',
  },
  {
    category: 'utah',
    question: 'Where is the bankruptcy court in Utah?',
    answer: 'The U.S. Bankruptcy Court for the District of Utah has locations in Salt Lake City, Ogden, and St. George. Most bankruptcy meetings (341 meetings) are held at these locations, though many proceedings can now be conducted virtually.',
  },
  {
    category: 'utah',
    question: 'Do I have to take credit counseling in Utah?',
    answer: 'Yes. Federal law requires you to complete credit counseling from an approved agency within 180 days before filing bankruptcy. You must also complete a debtor education course before receiving your discharge. Both courses can be completed online and typically cost $10-50 each.',
  },

  // Process Questions
  {
    category: 'process',
    question: 'What happens when I file bankruptcy?',
    answer: 'When you file, an "automatic stay" immediately goes into effect, stopping most collection actions, lawsuits, wage garnishments, and creditor contact. The court assigns a trustee to oversee your case. You\'ll attend a meeting of creditors (341 meeting) where the trustee asks questions about your finances under oath.',
  },
  {
    category: 'process',
    question: 'Will my employer find out if I file bankruptcy?',
    answer: 'Bankruptcy filings are public record, but employers rarely check. The court will not notify your employer unless you owe them money or have wages being garnished. In Chapter 13, your employer may receive a wage order to send plan payments directly from your paycheck, which they will become aware of.',
  },
  {
    category: 'process',
    question: 'Can I file bankruptcy without an attorney?',
    answer: 'While it\'s legally possible to file without an attorney (called "pro se"), it\'s strongly discouraged. Bankruptcy law is complex, and mistakes can result in your case being dismissed, loss of property, or non-discharge of debts. Most successful filers work with experienced bankruptcy attorneys.',
  },
  {
    category: 'process',
    question: 'How much does it cost to file bankruptcy?',
    answer: 'Filing fees are $338 for Chapter 7 and $313 for Chapter 13 (as of 2024). Attorney fees vary but typically range from $1,500-$3,000 for Chapter 7 and $3,000-$5,000 for Chapter 13 in Utah. Many attorneys offer payment plans, and Chapter 7 filing fees can be waived for low-income filers.',
  },
  {
    category: 'process',
    question: 'What is the 341 meeting?',
    answer: 'The 341 meeting (meeting of creditors) is a short hearing where you meet with the bankruptcy trustee and answer questions under oath about your financial situation and bankruptcy forms. Creditors are invited but rarely attend. The meeting typically lasts 5-15 minutes and is usually straightforward if you\'ve prepared properly with your attorney.',
  },
  {
    category: 'process',
    question: 'Can I be denied a discharge?',
    answer: 'Discharge can be denied if you fail to complete required courses, don\'t cooperate with the trustee, hide assets, lie on your bankruptcy forms, or engage in fraud. Following your attorney\'s guidance and being completely honest about your finances virtually eliminates this risk.',
  },
  {
    category: 'process',
    question: 'What is the automatic stay?',
    answer: 'The automatic stay is a powerful legal protection that goes into effect immediately when you file bankruptcy. It stops most creditor collection activities including lawsuits, wage garnishments, foreclosures, repossessions, and harassing phone calls. Creditors who violate the stay can face penalties.',
  },
  {
    category: 'process',
    question: 'Can I file bankruptcy more than once?',
    answer: 'Yes, but there are time limits. You must wait 8 years after receiving a Chapter 7 discharge to file Chapter 7 again. You can file Chapter 13 four years after a Chapter 7 discharge, or two years after a previous Chapter 13 discharge. These time limits protect against abuse of the bankruptcy system.',
  },
];

const categories = [
  { id: 'all', label: 'All Questions' },
  { id: 'general', label: 'General' },
  { id: 'chapter7', label: 'Chapter 7' },
  { id: 'chapter13', label: 'Chapter 13' },
  { id: 'utah', label: 'Utah-Specific' },
  { id: 'process', label: 'The Process' },
];

export default function FAQPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const filteredFaqs = selectedCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const handleBack = () => {
    router.back();
  };

  // Add FAQ structured data to page for rich search results
  useEffect(() => {
    const faqSchema = generateFAQSchema(faqs);
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-parchment via-background to-parchment">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-wood-dark via-forest-dark to-wood-dark text-parchment py-16 wood-texture relative">
        <div className="absolute inset-0 bg-forest-dark/20"></div>
        <div className="container mx-auto px-4 max-w-6xl relative">
          <button
            onClick={handleBack}
            className="text-parchment hover:text-gold text-sm flex items-center mb-6 transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-parchment/20 rounded-full flex items-center justify-center border-2 border-gold/30">
              <HelpCircle className="w-8 h-8 text-gold" />
            </div>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4">
            Bankruptcy FAQ
          </h1>
          <p className="text-xl text-parchment/90 text-center max-w-3xl mx-auto">
            Get answers to common questions about bankruptcy in Utah
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 max-w-6xl -mt-8">
        <div className="bg-parchment/90 backdrop-blur-sm rounded-lg cabin-shadow parchment-texture border-2 border-wood-light/30 p-4 mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-wood-dark text-parchment cabin-shadow'
                    : 'bg-wood-light/20 text-wood-dark hover:bg-wood-light/40'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="container mx-auto px-4 max-w-4xl pb-16">
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-parchment/80 backdrop-blur-sm rounded-lg cabin-shadow parchment-texture border border-wood-light/30 overflow-hidden transition-all hover:shadow-xl"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-wood-light/10 transition-colors"
              >
                <span className="font-semibold text-wood-dark pr-8">
                  {faq.question}
                </span>
                {openItems.has(index) ? (
                  <ChevronUp className="w-5 h-5 text-forest-dark flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-wood-medium flex-shrink-0" />
                )}
              </button>

              {openItems.has(index) && (
                <div className="px-6 py-4 bg-wood-light/5 border-t border-wood-light/30">
                  <p className="text-foreground/80 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No questions found in this category.</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-wood-dark via-forest-dark to-wood-dark py-16 wood-texture overflow-hidden">
        <div className="absolute inset-0 bg-forest-dark/20"></div>
        <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-gold/30"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-gold/30"></div>
        <div className="container mx-auto px-4 max-w-4xl text-center relative">
          <h2 className="font-serif text-3xl font-bold text-parchment mb-4">
            Still Have Questions?
          </h2>
          <p className="text-parchment/90 text-lg mb-8 max-w-2xl mx-auto">
            Every bankruptcy case is unique. Get personalized answers and find out if bankruptcy is right for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/intake"
              className="inline-block bg-parchment text-wood-dark px-8 py-3 rounded-lg font-semibold hover:bg-parchment/90 transition-all duration-200 hover:scale-105 cabin-shadow"
            >
              Check Your Options
            </Link>
            <a
              href="tel:+13854388161"
              className="inline-block bg-gold text-wood-dark px-8 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-all duration-200 hover:scale-105 cabin-shadow"
            >
              Call (385) 438-8161
            </a>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-wood-light/10 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-parchment/90 backdrop-blur-sm rounded-lg p-6 border-l-4 border-burgundy cabin-shadow">
            <p className="text-sm text-foreground/80">
              <strong className="text-wood-dark">Disclaimer:</strong> The information provided on this page is for general informational purposes only and does not constitute legal advice. Bankruptcy laws are complex and vary based on individual circumstances. For advice specific to your situation, please consult with a qualified bankruptcy attorney. Lincoln Law serves clients throughout Utah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
