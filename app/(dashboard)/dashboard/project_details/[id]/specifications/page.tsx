// app/dashboard/project_details/[id]/specifications/page.tsx
'use client';
import React, { useCallback, useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useLoadingAPI } from '@/app/hooks/useLoadingAPI';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const SpecificationsPage = () => {
  const { data: session } = useSession();

  const [selectedSpecification, setSelectedSpecification] = useState<any[]>([]);
  const [specificationData, setSpecificationData] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [currentForm, setCurrentForm] = useState<any | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [formStatus, setFormStatus] = useState<any>({});
  const [tempFormData, setTempFormData] = useState<any>({});
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const params = useParams();
  const [projectId, setProjectId] = useState(params.id);
  const [specModal, setSpecModal] = useState<any>(false);

  const isFieldComplete = useCallback((field: any, data: any) => {
    if (!field || !data) return false;

    const fieldData = data[field.attributeName];
    if (field.inputType === 'checkbox') {
      return Object.values(fieldData || {}).some(Boolean);
    } else if (field.inputType === 'radio') {
      return !!fieldData;
    } else if (field.disabled === true) {
      return true;
    } else {
      return !!fieldData && fieldData.trim() !== '';
    }
  }, []);

  const isFormComplete = useCallback(
    (form: any, data: any) => {
      if (!form || !data) return { isComplete: false, percentage: 0 };

      const formFields = form.attributes.spec_configurations.sections.flatMap(
        (section: any) => section.fields
      );
      const completedFields = formFields.filter((field: any) =>
        isFieldComplete(
          field,
          data[form.attributes.spec_configurations.title] || {}
        )
      );
      return {
        isComplete: formFields.length === completedFields.length,
        percentage: (completedFields.length / formFields.length) * 100
      };
    },
    [isFieldComplete]
  );

  const updateAllFormsStatus = useCallback(
    (data: any, specifications: any) => {
      const newStatus: {
        [key: string]: { status: string; percentage: number };
      } = {};
      specifications?.forEach((form: any) => {
        const formData = data[form.attributes.spec_configurations.title] || {};
        const { isComplete, percentage } = isFormComplete(form, data);
        const isPartiallyComplete =
          form.attributes?.spec_configurations?.sections?.some(
            (section: any) =>
              section?.fields?.some((field: any) =>
                isFieldComplete(field, formData)
              )
          ) || false;

        newStatus[form.attributes.code] = {
          status: isComplete
            ? 'complete'
            : isPartiallyComplete
            ? 'partial'
            : 'not-started',
          percentage: percentage
        };
      });
      setFormStatus(newStatus);
      console.log('newStatus', newStatus);
    },
    [isFormComplete, isFieldComplete]
  );

  // const getProjectDataFromLocalStorage = useCallback(async () => {
  //   try {
  //     const selectedProject = localStorage.getItem("selectedProject");
  //     if (selectedProject && selectedProject !== "undefined") {
  //       const parsedProject = JSON.parse(selectedProject);
  //       const selectedSpecifications = JSON.parse(
  //         localStorage.getItem("projectSpecifications")
  //       );

  //       const savedFormData = localStorage.getItem("formData");
  //       const parsedFormData = savedFormData ? JSON.parse(savedFormData) : {};

  //       return { parsedProject, selectedSpecifications, parsedFormData };
  //     } else {
  //       return {
  //         parsedProject: null,
  //         selectedSpecifications: null,
  //         parsedFormData: {},
  //       };
  //     }
  //   } catch (error) {
  //     console.error("Error parsing localStorage data:", error);
  //     return {
  //       parsedProject: null,
  //       selectedSpecifications: null,
  //       parsedFormData: {},
  //     };
  //   }
  // }, []);

  // const updateStates = useCallback(
  //   (data) => {
  //     const { parsedProject, selectedSpecifications, parsedFormData } = data;
  //     setSelectedProject(parsedProject);
  //     setSelectedSpecification(selectedSpecifications);
  //     setFormData(parsedFormData);
  //     updateAllFormsStatus(parsedFormData, selectedSpecifications);
  //   },
  //   [updateAllFormsStatus]
  // );

  const { fetchWithLoading } = useLoadingAPI();

  useEffect(() => {
    console.log(
      'specData',
      specificationData,
      'selectede',
      selectedSpecification
    );

    if (specificationData && selectedSpecification) {
      let formData: { [key: string]: any } = {};

      specificationData.forEach((spec: any) => {
        console.log('spec', spec);

        let filter_specification_code = selectedSpecification?.filter(
          (specification: any) =>
            specification.id ===
            spec?.relationships?.specification_codes?.data.id
        );

        if (filter_specification_code.length > 0) {
          formData[
            filter_specification_code[0].attributes.spec_configurations
              .title as string
          ] = spec.attributes.detailed_specs;
        }
      });

      console.log('formData', formData);

      setFormData(formData);
      updateAllFormsStatus(formData, selectedSpecification);
    }
  }, [specificationData, selectedSpecification]);

  useEffect(() => {
    const handleGetSelectionSpecifications = async () => {
      if (!projectId) return;

      try {
        const resp = await fetchWithLoading(
          `/api/specificationCodes?filter[project]=${projectId}`
        );

        if (resp.status == 200) {
          setSelectedSpecification(resp.body.data);
        } else {
          console.error('Error fetching project specifications:', resp);
        }
      } catch (error) {
        console.error('Error fetching project specifications:', error);
      }
    };

    const handleGetSpecifications = async () => {
      if (!projectId) return;

      try {
        const resp = await fetchWithLoading(
          `/api/specification?filter[project]=${projectId}`
        );

        if (resp.status == 200) {
          setSpecificationData(resp.body.data);
        } else {
          console.error('Error fetching project specifications:', resp);
        }
      } catch (error) {
        console.error('Error fetching project specifications:', error);
      }
    };

    const handleGetProjectData = async () => {
      if (!projectId) return;

      try {
        const resp = await fetchWithLoading(
          `/api/generic-model/project/${projectId}`
        );

        if (resp.ok) {
          setSelectedProject(resp.model);
        } else {
          console.error('Error fetching project data:', resp);
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };
    handleGetSelectionSpecifications();
    handleGetProjectData();
    handleGetSpecifications();
  }, [projectId, session?.user.apiUserToken]);

  // const loadProjectData = useCallback(async () => {
  //   try {
  //     // const data = await getProjectDataFromLocalStorage();
  //     await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
  //     // updateStates(data);
  //   } catch (error) {
  //     console.error("Error loading project data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [getProjectDataFromLocalStorage, updateStates]);

  // useEffect(() => {
  //   loadProjectData();
  // }, [loadProjectData]);

  // useEffect(() => {
  //   if (selectedSpecification && formData) {
  //     updateAllFormsStatus(formData, selectedSpecification);
  //   }
  // }, [selectedSpecification, formData, updateAllFormsStatus]);

  const handleSpecificationClick = (specification: any) => {
    let currentFormObj = {
      ...specification.attributes.spec_configurations,
      specification_codes_id: specification.id,
      specification_id: specification?.relationships?.specification?.data.id
    };
    console.log('currentFormObj', currentFormObj);
    setCurrentForm(currentFormObj); // Update the current form being edited
    setTempFormData((prev: any) => ({
      ...prev,
      [specification.attributes.code]:
        formData[specification.attributes.spec_configurations.title] || {}
    }));
  };

  useEffect(() => {
    if (currentForm && formData[currentForm.title]) {
      setTempFormData((prev: any) => ({
        ...prev,
        [currentForm.title]: formData[currentForm.title]
      }));
    }
  }, [currentForm, formData]);

  const handleInputChange = (e: any, field: any) => {
    const { value, type, checked, id } = e.target;
    const fieldValue = type === 'checkbox' || type === 'radio' ? id : value;

    setTempFormData((prevData: any) => ({
      ...prevData,
      [currentForm.title || '']: {
        ...(prevData[currentForm.title] || {}),
        [field.attributeName]:
          type === 'checkbox'
            ? {
                ...(prevData[currentForm.title]?.[field.attributeName] || {}),
                [fieldValue]: checked
              }
            : fieldValue
      }
    }));
  };

  const handleSave = async () => {
    // const updatedFormData = {
    //   ...formData,
    //   [currentForm.title]: tempFormData[currentForm.title], // Update the current form's data
    // };
    // setFormData(updatedFormData);
    // updateAllFormsStatus(updatedFormData, selectedSpecification);
    // localStorage.setItem("formData", JSON.stringify(updatedFormData));
    // document.querySelector('[data-hs-overlay="#add-task"]').click();

    try {
      let specification_filter = specificationData.filter(
        (spec) => spec.id === currentForm.specification_id
      );

      let formatedData = {
        data: {
          type: specification_filter[0].type,
          id: specification_filter[0].id,
          attributes: {
            ...specification_filter[0].attributes,
            detailed_specs: tempFormData[currentForm.title as string]
          }
        }
      };

      // const payload = {};

      // console.log("specification id", currentForm.specification_id);

      // console.log("specification_filter", specification_filter);

      // console.log("formatedData", formatedData);

      let resp = await fetch(
        `/api/specification/${currentForm.specification_id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user.apiUserToken}`
          },
          body: JSON.stringify(formatedData)
        }
      );

      let data = await resp.json();

      if (resp.ok) {
        console.log('data', data);
        const updatedFormData = {
          ...formData,
          [currentForm.title]: tempFormData[currentForm.title] // Update the current form's data
        };
        setFormData(updatedFormData);
        updateAllFormsStatus(updatedFormData, selectedSpecification);
      } else {
        console.error('Error saving form data:', data);
      }
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const handleCancel = () => {
    setTempFormData((prev: any) => ({
      ...prev,
      [currentForm.title]: formData[currentForm.title] || {}
    }));
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const lineHeight = 7;
      let yPos = 15;

      const getFieldValue = (form: any, field: any) => {
        try {
          return formData[form.attributes.spec_configurations.title]?.[
            field.attributeName
          ];
        } catch {
          return field.inputType === 'checkbox' ? {} : '';
        }
      };

      const drawText = (text: any, x: any, y: any, options = {}) => {
        try {
          doc.text(text, x, y, options);
        } catch (e) {
          console.error(`Error drawing text: ${text}`, e);
        }
      };

      const handleOptionField = (
        field: any,
        value: any,
        xPos: any,
        yPos: any
      ) => {
        const boxSize = 4;
        const boxMargin = 1;

        field?.options?.forEach((option: any) => {
          const optionValue = option.value.toString();
          const isChecked =
            field.inputType === 'checkbox'
              ? value?.[`${field.attributeName}-${optionValue}`] || false
              : value?.split('-').pop() === optionValue;

          // Draw the box
          doc.setDrawColor(0).rect(xPos, yPos - boxSize + 1, boxSize, boxSize);

          // Draw tick (✓) inside the box if selected
          if (isChecked) {
            doc
              .setDrawColor('0')
              .setFillColor('0')
              .rect(xPos, yPos - boxSize + 1, boxSize, boxSize, 'F');
          }

          // Draw the label
          drawText(option.label, xPos + boxSize + boxMargin + 1, yPos);

          xPos += doc.getTextWidth(option.label) + boxSize + boxMargin + 15;
          if (xPos > pageWidth - margin - 50) {
            xPos = margin;
            yPos += lineHeight + 3;
          }
        });
        return yPos;
      };

      selectedSpecification?.forEach((form, formIndex) => {
        if (formIndex > 0) {
          doc.addPage();
          yPos = 15;
        }

        try {
          doc
            .setDrawColor(0)
            .setFillColor(255, 250, 205)
            .rect(margin, yPos, pageWidth - 2 * margin, 15, 'F')
            .setFontSize(14)
            .setFont('', 'bold')
            .setTextColor(0)
            .text(
              form.attributes.spec_configurations.title,
              margin + 5,
              yPos + 10
            );
          yPos += 25;
        } catch (e) {
          console.error(
            `Error adding form header: ${form.attributes.spec_configurations.title}`,
            e
          );
        }

        form?.attributes?.spec_configurations?.sections?.forEach(
          (section: any) => {
            try {
              doc
                .setFontSize(12)
                .setFont('', 'bold')
                .text(section.sectionName.toUpperCase() + ':', margin, yPos)
                .setFont('', 'normal');
              yPos += lineHeight * 1.5;
            } catch (e) {
              console.error(`Error adding section: ${section.sectionName}`, e);
            }

            section?.fields?.forEach((field: any) => {
              try {
                const value = getFieldValue(form, field);
                const label = field.label ? `${field.label}:` : '';
                const attributeName = field.attributeName
                  ? `${field.attributeName}:`
                  : '';
                const labelText = label || attributeName || '';
                const labelWidth = doc.getTextWidth(labelText);

                if (
                  field.inputType === 'checkbox' ||
                  field.inputType === 'radio'
                ) {
                  drawText(labelText, margin, yPos + 3);
                  let xPos = margin + labelWidth + 10;
                  yPos = handleOptionField(field, value, xPos, yPos);
                  yPos += lineHeight + 5;
                } else {
                  if (field.disabled) {
                    drawText(labelText, margin, yPos + lineHeight - 2);
                    yPos += lineHeight + 5;
                  } else {
                    drawText(labelText, margin, yPos + lineHeight - 2);
                    const maxLineWidth = pageWidth - margin - labelWidth - 30;

                    doc
                      .setDrawColor(0)
                      .line(
                        margin + labelWidth + 5,
                        yPos + lineHeight,
                        pageWidth - margin - 10,
                        yPos + lineHeight
                      );

                    const displayValue = value?.toString() || '';
                    drawText(
                      displayValue,
                      margin + labelWidth + 10,
                      yPos + lineHeight - 2,
                      {
                        maxWidth: maxLineWidth
                      }
                    );
                    yPos += lineHeight + 5;

                    const textLines = doc.splitTextToSize(
                      displayValue,
                      maxLineWidth
                    );
                    if (textLines.length > 1) {
                      textLines.slice(1).forEach((line: any) => {
                        yPos += lineHeight;
                        drawText(
                          line,
                          margin + labelWidth + 10,
                          yPos + lineHeight - 2
                        );
                      });
                      yPos += lineHeight;
                    }
                  }
                }

                if (yPos > pageHeight - 30) {
                  doc.addPage();
                  yPos = 15;
                }
              } catch (e) {
                console.error(
                  `Error adding field: ${field.label || field.attributeName}`,
                  e
                );
              }
            });

            yPos += lineHeight;
          }
        );
      });

      doc.save(`specifications-${selectedProject?.name ?? 'project'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the PDF. Please try again.');
    }
  };

  const renderInputField = (field: any) => {
    const value = tempFormData[currentForm.title]?.[field.attributeName] || '';
    switch (field.inputType) {
      case 'text':
      case 'number':
        return (
          <input
            type={field.inputType}
            className="form-control w-full !rounded-md"
            id={field.attributeName}
            placeholder={field.placeholder || field.label}
            disabled={field.disabled}
            value={value}
            onChange={(e) => handleInputChange(e, field)}
          />
        );
      case 'radio':
        return field.options.map((option: any, optionIndex: any) => (
          <div key={optionIndex} className="mb-2 flex items-center">
            <input
              type="radio"
              id={`${field.attributeName}-${option.value}`}
              name={field.attributeName}
              value={option.value}
              className="form-radio text-primary"
              checked={value === `${field.attributeName}-${option.value}`}
              onChange={(e) => handleInputChange(e, field)}
            />
            <label
              htmlFor={`${field.attributeName}-${option.value}`}
              className="ml-2"
            >
              {option.label}
            </label>
          </div>
        ));
      case 'checkbox':
        return field.options?.map((option: any, optionIndex: any) => (
          <div key={optionIndex} className="mb-2 flex items-center">
            <input
              type="checkbox"
              id={`${field.attributeName}-${option.value}`}
              name={field.attributeName}
              value={option.value}
              className="form-checkbox text-primary"
              checked={
                value?.[`${field.attributeName}-${option.value}`] || false
              }
              onChange={(e) => handleInputChange(e, field)}
            />
            <label
              htmlFor={`${field.attributeName}-${option.value}`}
              className="ml-2"
            >
              {option.label}
            </label>
          </div>
        ));
      case 'textarea':
        return (
          <textarea
            className="form-control w-full !rounded-md"
            id={field.attributeName}
            rows={3}
            placeholder={field.placeholder || 'Enter text...'}
            disabled={field.disabled}
            value={value}
            onChange={(e) => handleInputChange(e, field)}
          ></textarea>
        );
      default:
        return null;
    }
  };

  const renderDynamicForm = () => {
    if (!currentForm) return null;

    return (
      <div className="ti-modal-body !overflow-visible px-4">
        <h6 className="mb-4 text-lg font-semibold">{currentForm.title}</h6>
        {currentForm.sections.map((section: any, sectionIndex: any) => (
          <div key={sectionIndex} className="mb-6">
            <h6 className="mb-3 text-base font-semibold">
              {section.sectionName}
            </h6>
            <div className="grid grid-cols-12 gap-6">
              {section.fields?.map((field: any, fieldIndex: any) => (
                <div key={fieldIndex} className="col-span-12 xl:col-span-6">
                  <label htmlFor={field.attributeName} className="form-label">
                    {field.label}
                  </label>
                  {renderInputField(field)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 bg-gray-100 p-6">
      <h1 className="text-3xl font-bold">Project Specifications</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {selectedSpecification?.map((spec, index) => (
          <Dialog
            open={specModal}
            onOpenChange={(open) => setSpecModal(open)}
            key={index}
          >
            <DialogTrigger asChild>
              <Card
                key={index}
                onClick={() => {
                  handleSpecificationClick(spec);
                }}
              >
                <div
                  className={`box mb-4 flex cursor-pointer !flex-row !items-center !justify-between !gap-2 !p-6 !px-8 shadow-[0px_6px_54.6px_0px_#0000000F]`}
                >
                  <div className=" flex flex-col items-start !justify-between gap-2">
                    <div className=" line-clamp-1 text-base font-semibold">
                      {spec?.code?.length > 20 ? (
                        <span className="line-clamp-1">
                          {spec?.code?.slice(0, 20)}...
                        </span>
                      ) : (
                        spec?.code
                      )}
                    </div>
                    <div
                      className={`line-clamp-1 font-normal ${
                        formStatus[spec.code]?.status === 'complete'
                          ? 'text-green-600'
                          : formStatus[spec.code]?.status === 'partial'
                          ? 'text-orange-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {formStatus[spec.code]?.status === 'complete'
                        ? 'Complete'
                        : formStatus[spec.code]?.status === 'partial'
                        ? 'In Progress'
                        : 'Not Started'}
                    </div>
                  </div>
                  <div className=" h-16 w-16 ">
                    {formStatus[spec.code]?.status === 'complete' ? (
                      <div className="SPC-single-chart">
                        <svg
                          viewBox="0 0 36 36"
                          className="SPC-circular-chart SPC-green"
                        >
                          <path
                            className="SPC-circle-bg"
                            d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="SPC-circle"
                            stroke-dasharray={`${formStatus[spec.code]
                              ?.percentage}, 100`}
                            d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <text
                            x="18"
                            y="20.35"
                            className="SPC-percentage text-green-600"
                          >
                            100%
                          </text>
                        </svg>
                      </div>
                    ) : formStatus[spec.code]?.status === 'partial' ? (
                      <div className="SPC-single-chart">
                        <svg
                          viewBox="0 0 36 36"
                          className="SPC-circular-chart SPC-orange"
                        >
                          <path
                            className="SPC-circle-bg"
                            d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="SPC-circle"
                            stroke-dasharray={`${formStatus[spec.code]
                              ?.percentage}, 100`}
                            d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <text
                            x="18"
                            y="20.35"
                            className="SPC-percentage text-orange-600"
                          >
                            {Math.round(formStatus[spec.code]?.percentage)}%
                          </text>
                        </svg>
                      </div>
                    ) : (
                      <div className="SPC-single-chart">
                        <svg
                          viewBox="0 0 36 36"
                          className="SPC-circular-chart SPC-blue"
                        >
                          <path
                            className="SPC-circle-bg"
                            d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="SPC-circle"
                            stroke-dasharray="0, 100"
                            d="M
                            18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <text
                            x="18"
                            y="20.35"
                            className="SPC-percentage text-gray-700"
                          >
                            0%
                          </text>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <div>
                <div className="hs-overlay-open:mt-7 ti-modal-box m-3 mt-0 ease-out lg:!mx-auto lg:w-full lg:!max-w-4xl">
                  <div className="ti-modal-content">
                    <div className="ti-modal-header">
                      <h6 className="modal-title text-default dark:text-defaulttextcolor/70 text-[1rem] font-semibold">
                        Specification Details
                      </h6>
                      <button
                        type="button"
                        className="hs-dropdown-toggle !text-[1rem] !font-semibold"
                        data-hs-overlay="#add-task"
                      >
                        <span className="sr-only">Close</span>
                        <i className="ri-close-line"></i>
                      </button>
                    </div>
                    {renderDynamicForm()}
                    <div className="ti-modal-footer !flex-col-reverse gap-1">
                      <button
                        type="button"
                        className="hs-dropdown-toggle ti-btn ti-btn-light !w-full align-middle"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="ti-btn !w-full bg-primary !font-medium text-white"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* <DialogFooter className="ml-auto sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>

            
              </DialogFooter> */}
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};

export default SpecificationsPage;
